package main

import (
	"log"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/glebarez/sqlite"
	"gorm.io/gorm"

	"gshare.com/platform/models"
)

var db *gorm.DB

func connectDatabase() error {
	var err error
	db, err = gorm.Open(sqlite.Open("kiku.db"), &gorm.Config{})
	if err != nil {
		panic("Error connecting/creating the sqlite db")
	}
	db.AutoMigrate(&models.User{})
	return err
}

func checkErr(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

func main() {
	err := connectDatabase()
	checkErr(err)

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "X-CSRF-Token", "Authorization", "Origin"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	//API v1
	v1 := r.Group("/api/v1")
	{
		// user routes
		v1.GET("user", getUsers)
		v1.GET("user/:username", getUserByUsername)
		v1.POST("register", register)
		v1.PUT("user", updateUser)
		v1.DELETE("user", deleteUser)
		v1.POST("login", login)
		v1.POST("logout", logout)
		v1.GET("current-user", getCurrentUser)
		v1.OPTIONS("user", options)
	}

	// By default it serves on :8080 unless a
	// PORT environment variable was defined.
	r.Run()
}

func getUsers(c *gin.Context) {

	var users []models.User

	result := db.Limit(10).Find(&users)

	checkErr(result.Error)

	if users == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No Records Found"})
		return
	} else {
		c.JSON(http.StatusOK, gin.H{"data": users})
	}
}

func getUserByUsername(c *gin.Context) {

	username := c.Param("username")

	var user models.User

	result := db.First(&user, "username = ?", username)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No Records Found"})
		return
	} else {
		c.JSON(http.StatusOK, gin.H{"data": user})
	}
}

func register(c *gin.Context) {

	var newUser models.User

	//Check that the request is in the correct format
	if err := c.ShouldBindJSON(&newUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//Check if there is already a user with that username (could implement frontend requirements for this without using http requests)
	if err := db.First(&newUser, "username = ?", newUser.Username).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username already exists"})
		return
	}

	//Hash the password using bcrypt
	newUser.Password, _ = hashPassword(newUser.Password)

	//Add to database
	result := db.Create(&newUser)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": result.Error})
	}

	//Generate tokens and pass to user cookies
	sessionToken := generateToken(32)
	csrfToken := generateToken(32)

	c.SetCookie("session_token", sessionToken, 3600, "/", "localhost", false, true)
	c.SetCookie("csrf_token", csrfToken, 3600, "/", "localhost", false, false)

	//Store tokens in the database
	db.Model(&newUser).Where("username = ?", newUser.Username).Updates(map[string]any{"session_token": sessionToken, "csrf_token": csrfToken})
	c.JSON(http.StatusCreated, gin.H{"message": "Successfully registered user: " + newUser.Username})
}

func login(c *gin.Context) {

	var loginInfo models.User

	//Bind the username and password into the user struct
	if err := c.ShouldBindJSON(&loginInfo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	username := loginInfo.Username
	password := loginInfo.Password

	//Check username and password match
	var user models.User
	result := db.First(&user, "username = ?", username)
	if result == nil || !checkPasswordHash(password, user.Password) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid username or password"})
		return
	}

	//Generate tokens and pass to user cookies
	sessionToken := generateToken(32)
	csrfToken := generateToken(32)

	c.SetCookie("session_token", sessionToken, 3600, "/", "localhost", false, true)
	c.SetCookie("csrf_token", csrfToken, 3600, "/", "localhost", false, false)

	//Store tokens in the database
	db.Model(&user).Where("username = ?", username).Updates(map[string]any{"session_token": sessionToken, "csrf_token": csrfToken})
	c.JSON(http.StatusOK, gin.H{"message": "Login successful"})
}

func logout(c *gin.Context) {

	//Check if user is logged in
	if err := Authorize(c); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	//Clear cookies
	c.SetCookie("session_token", "", -1, "/", "localhost", false, true)
	c.SetCookie("csrf_token", "", -1, "/", "localhost", false, false)

	username := getUsername(c)

	var user models.User

	//Check that user exists
	if err := db.First(&user, "username = ?", username).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No such user" + username})
		return
	}

	//Clear tokens from db
	user.SessionToken = ""
	user.CSRFToken = ""
	db.Model(&user).Where("username = ?", username).Updates(map[string]any{"session_token": "", "csrf_token": ""})
	c.JSON(http.StatusOK, gin.H{"message": "Logout successful"})
}

func updateUser(c *gin.Context) {

	if err := Authorize(c); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	username := getUsername(c)
	if username == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	type UpdateRequest struct {
		CurrentPassword string `json:"currentPassword"`
		NewUsername     string `json:"username"`
		NewEmail        string `json:"email"`
		NewPassword     string `json:"newPassword"`
	}

	var updateReq UpdateRequest
	if err := c.ShouldBindJSON(&updateReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var currentUser models.User
	if err := db.First(&currentUser, "username = ?", username).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if updateReq.NewUsername != "" && updateReq.NewUsername != username {
		var existingUser models.User
		if err := db.First(&existingUser, "username = ?", updateReq.NewUsername).Error; err == nil {
			c.JSON(http.StatusConflict, gin.H{"error": "Username already exists"})
			return
		}
	}

	if updateReq.NewEmail != "" && updateReq.NewEmail != currentUser.Email {
		var existingUser models.User
		if err := db.First(&existingUser, "email = ?", updateReq.NewEmail).Error; err == nil {
			c.JSON(http.StatusConflict, gin.H{"error": "Email already exists"})
			return
		}
	}

	if updateReq.NewPassword != "" {
		if updateReq.CurrentPassword == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Enter your current password"})
			return
		}
		if !checkPasswordHash(updateReq.CurrentPassword, currentUser.Password) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Current password is incorrect"})
			return
		}
		hashedNewPassword, _ := hashPassword(updateReq.NewPassword)
		updateReq.NewPassword = hashedNewPassword
	}

	if err := db.Model(&models.User{}).Where("username = ?", username).Updates(models.User{Username: updateReq.NewUsername, Email: updateReq.NewEmail, Password: updateReq.NewPassword}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user"})
		return
	}

	responseData := gin.H{
		"username": updateReq.NewUsername,
		"email":    updateReq.NewEmail,
	}

	c.JSON(http.StatusOK, gin.H{"data": responseData})
}

func deleteUser(c *gin.Context) {

	//Check if user is logged in
	if err := Authorize(c); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err})
		return
	}

	username := getUsername(c)

	var user models.User

	if err := db.First(&user, "username = ?", username).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found"})
		return
	}

	db.Delete(&user, "username = ?", username)
	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}

func getCurrentUser(c *gin.Context) {

	// Check if user is logged in
	if err := Authorize(c); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	username := getUsername(c)
	if username == "" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized 2"})
		return
	}

	// Return the username
	c.JSON(http.StatusOK, gin.H{"username": username})
}

func options(c *gin.Context) {

	c.JSON(http.StatusOK, gin.H{"message": "options Called"})

}
