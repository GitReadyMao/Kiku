package main

import (
	"log"
	"net/http"
	"time"

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

		// term routes
		v1.GET("nextterm", getNextTerm)
		v1.POST("studyterm", studyTerm)

		// group routes
		v1.GET("group", getGroups) // get groups
		//v1.GET("group/:")          // get group by name
		v1.GET("lookup", lookup) // get user
		v1.POST("unite", unite)  // create group
		v1.POST("join", join)    // join group
		v1.PUT("invite", invite)
		v1.DELETE("leave", leave)     // leave group
		v1.DELETE("disband", disband) // delete group
	}

	// By default it serves on :8080 unless a
	// PORT environment variable was defined.
	r.Run()
}

func getUsers(c *gin.Context) {

	type UserQuery struct {
		Column    string `json:"column"`
		Order     string `json:"order"`
		Limit     int    `json:"limit"`
		Offset    int    `json:"offset"`
		SearchKey string `json:"search_key"`
	}

	//Start by reading in the sorting column and direction
	var userQuery UserQuery
	if err := c.ShouldBindJSON(&userQuery); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//If no limit or offset was passed in, set to -1 for the SQL command
	if userQuery.Limit == 0 {
		userQuery.Limit = -1
	}
	if userQuery.Offset == 0 {
		userQuery.Offset = -1
	}

	//Format the order for sorting
	var order string
	if userQuery.Order != "" {
		order = userQuery.Column + " " + userQuery.Order
	} else {
		order = userQuery.Column
	}

	var users []models.User

	// Fetch posts ordered by the passed in column, with slices specified
	result := db.Where("username LIKE ?", "%"+userQuery.SearchKey+"%").Or("email LIKE ?", "%"+userQuery.SearchKey+"%").Order(order).Limit(userQuery.Limit).Offset(userQuery.Offset).Find(&users)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": result.Error.Error()})
		return
	}

	//Get the count
	var count int64
	db.Model(&models.User{}).Where("username LIKE ?", "%"+userQuery.SearchKey+"%").Or("email LIKE ?", "%"+userQuery.SearchKey+"%").Count(&count)

	c.JSON(http.StatusOK, gin.H{"count": count, "data": users})
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

func getNextTerm(c *gin.Context) {

	//Check if user is logged in
	if err := Authorize(c); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err})
		return
	}

	var nextTerm models.Studies

	if err := db.Where("username = ?", getUsername(c)).Where("study_time < ?", time.Now()).Where("study_time = (?)", db.Table("Studies").Where("username = ?", getUsername(c)).Select("MIN(study_time)")).First(&nextTerm).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": nextTerm})
}

func studyTerm(c *gin.Context) {

	//Check if user is logged in
	if err := Authorize(c); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err})
		return
	}

	type StudyQuery struct {
		TermId   int
		LevelMod int
	}

	//Start by reading in the term id and correctness
	var studyQuery StudyQuery
	if err := c.ShouldBindJSON(&studyQuery); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//Get the current level
	var level int
	if err := db.Select("level").Where("username = ?", getUsername(c)).Where("term_id = ?", studyQuery.TermId).First(&level); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No such term"})
		return
	}

	//Update the level
	if err := db.Where("username = ?", getUsername(c)).Where("term_id = ?", studyQuery.TermId).Updates(models.Studies{Level: level + studyQuery.LevelMod, StudyTime: getSRSTime(level + studyQuery.LevelMod)}); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No such term"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Term Studied"})
}

func getGroups(c *gin.Context) {
	var groups []models.Group

	result := db.Find(&groups)

	checkErr(result.Error)

	if groups == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No Groups Found"})
		return
	} else {
		c.JSON(http.StatusOK, gin.H{"data": groups})
	}
}

func unite(c *gin.Context) {
	//check if user is logged in
	if err := Authorize(c); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err})
		return
	}

	var newGroup models.Group
	username := getUsername(c)

	//check format is correct
	if err := c.ShouldBindJSON(&newGroup); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//check if group already exists
	if err := db.First(&newGroup, "name = ?", newGroup.Name).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Group name already exists"})
		return
	}

	//make new group
	group_result := db.Create(&newGroup)
	if group_result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": group_result.Error})
	}

	//fill in partof relation
	var newPart = models.PartOf{GroupName: newGroup.Name, Username: username}
	//newPart.GroupName = newGroup.Name
	//newPart.Username = username

	//make new partof relation
	part_result := db.Create(&newPart)
	if part_result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": part_result.Error})
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Successfully created group: " + newGroup.Name})
}

func join(c *gin.Context) {
	if err := Authorize(c); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err})
		return
	}

	type JoinQuery struct {
		GroupCode string `json:"group_code"`
	}
	var jquery JoinQuery

	var newGroup models.Group
	username := getUsername(c)

	//check format is correct
	if err := c.ShouldBindJSON(&jquery); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := db.First(&newGroup, "invite_code = ?", jquery.GroupCode).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Group does not exist"})
		return
	}

	db.Model(&newGroup).Where("name = ?", newGroup.Name).Updates(models.Group{MemberCount: newGroup.MemberCount + 1})

	//fill in partof relation
	var newPart models.PartOf
	newPart.GroupName = newGroup.Name
	newPart.Username = username

	//make new partof relation
	part_result := db.Create(&newPart)
	if part_result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": part_result.Error})
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Successfully joined group: " + newGroup.Name})
}

func leave(c *gin.Context) {
	if err := Authorize(c); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err})
		return
	}

	var newGroup models.Group
	username := getUsername(c)

	//check format is correct
	if err := c.ShouldBindJSON(&newGroup); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := db.First(&newGroup, "name = ?", newGroup.Name).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Group does not exist"})
		return
	}

	db.Model(&newGroup).Where("name = ?", newGroup.Name).Updates(models.Group{Name: newGroup.Name, MemberCount: newGroup.MemberCount - 1})

	//fill in partof relation
	var newPart models.PartOf
	//newPart.GroupName = newGroup.Name
	//newPart.Username = username

	if err := db.First(&newPart, "username = ?", username).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found"})
		return
	}

	db.Where("username = ?", newPart.Username).Delete(&newPart)

	c.JSON(http.StatusCreated, gin.H{"message": "Successfully left group: " + newGroup.Name})
}

func disband(c *gin.Context) {
	//check if user is logged in
	if err := Authorize(c); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err})
		return
	}

	username := getUsername(c)

	var group models.Group
	var part models.PartOf

	//find user in partof to get group
	if err := db.First(&part, "username = ?", username).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found"})
		return
	}

	//find group in group table
	if err := db.First(&group, "name = ?", part.GroupName).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found"})
		return
	}

	//delete group
	db.Where("name = ?", group.Name).Delete(&group)
	//delete users from partof table
	db.Where("group_name = ?", group.Name).Delete(&models.PartOf{})
	c.JSON(http.StatusOK, gin.H{"message": "Group deleted successfully"})
}

func invite(c *gin.Context) {
	if err := Authorize(c); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err})
		return
	}

	var partOf models.PartOf
	var newGroup models.Group
	username := getUsername(c)

	partOf.Username = username

	if err := db.First(&partOf, "username = ?", username).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Group does not exist"})
		return
	}

	db.Model(&newGroup).Where("name = ?", partOf.GroupName).Updates(models.Group{InviteCode: generateInviteCode(c)})

	c.JSON(http.StatusCreated, gin.H{"message": "Successfully created invite code"})
}

func lookup(c *gin.Context) {
	if err := Authorize(c); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err})
		return
	}
}
