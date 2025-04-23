package main

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"strconv"
	"testing"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"gshare.com/platform/models"
)

var testSessionToken string
var testCSRFToken string

func SetUpRouter() *gin.Engine {

	//DEBUG CODE FOR RUNNING INDIVIDUAL UNIT TESTS -------------- DELETE
	//testSessionToken = "B150Bbo7ogNjSvakXtWLHwBRa8FerS1K9SK7GPDhIos="
	//testCSRFToken = "f3L_w5ZcPNLa9vAw8NCIUj5xegjcu0kNfBxguDjzmHA="
	//DEBUG CODE FOR RUNNING INDIVIDUAL UNIT TESTS -------------- DELETE

	r := gin.Default()

	//COMMENT ONE TO CHANGE BETWEEN RUN MODES---------------------------------------------------------------
	gin.SetMode(gin.ReleaseMode)
	//gin.SetMode(gin.DebugMode)
	//COMMENT ONE TO CHANGE BETWEEN RUN MODES---------------------------------------------------------------

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "X-CSRF-Token", "Authorization", "Origin", "Lesson", "ID"},
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
		v1.GET("term/:lesson", getNextTerm)
		v1.GET("question-terms/:id", getQuestionTerms)
		v1.GET("term-count/:lesson", getTermCount)
		v1.POST("study-term", studyTerm)
		v1.PUT("initialize-lesson/:lesson", initializeLesson)

		// group routes
		v1.GET("group", getGroups) // get groups
		//v1.GET("group/:")          // get group by name
		v1.GET("lookup", lookup)      // get user
		v1.POST("unite/:name", unite) // create group
		v1.POST("join/:invite", join) // join group
		v1.PUT("invite", invite)
		v1.DELETE("leave", leave)     // leave group
		v1.DELETE("disband", disband) // delete group

		//leaderboard routes
		v1.GET("points", getPoints) // get points of all members in a group
	}

	// By default it serves on :8080 unless a
	// PORT environment variable was defined.
	return r
}

func TestRegister(t *testing.T) {
	err := connectDatabase()
	checkErr(err)
	r := SetUpRouter()

	user := models.User{
		Email:    "bettercallsaul@test.com",
		Username: "saul",
		Password: "Money123",
	}

	jsonValue, _ := json.Marshal(user)
	req, _ := http.NewRequest("POST", "/api/v1/register", bytes.NewBuffer(jsonValue))

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	mockResponse := `{"message":"Successfully registered user: saul"}`
	responseData, _ := io.ReadAll(w.Body)
	assert.Equal(t, mockResponse, string(responseData))
	assert.Equal(t, http.StatusCreated, w.Code)
}

func TestGetUsers(t *testing.T) {
	err := connectDatabase()
	checkErr(err)
	r := SetUpRouter()

	req, _ := http.NewRequest("GET", "/api/v1/user?column=username&order=desc&limit=10&offset=0&search_key=test", nil)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "data")
	assert.Contains(t, w.Body.String(), "count")

	var response map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &response)
	users := response["data"].([]interface{})
	assert.NotEmpty(t, users)
	count := response["count"]
	assert.NotEmpty(t, count)
}

func TestGetUserByUsername(t *testing.T) {
	err := connectDatabase()
	checkErr(err)
	r := SetUpRouter()

	var user models.User
	mockUser := models.User{
		Email:    "bettercallsaul@test.com",
		Username: "saul",
		Password: "Money123",
	}

	req, _ := http.NewRequest("GET", "/api/v1/user/saul", nil)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	response := w.Body.String()[8 : len(w.Body.String())-1]
	json.Unmarshal([]byte(response), &user)

	testSessionToken = user.SessionToken
	testCSRFToken = user.CSRFToken

	assert.Equal(t, mockUser.Email, user.Email)
	assert.Equal(t, mockUser.Username, user.Username)
	assert.True(t, checkPasswordHash(mockUser.Password, user.Password))
	assert.Equal(t, http.StatusOK, w.Code)
}

func TestLogout(t *testing.T) {
	err := connectDatabase()
	checkErr(err)
	r := SetUpRouter()

	user := models.User{
		Username: "saul",
		Password: "Money123",
	}

	jsonValue, _ := json.Marshal(user)
	req, _ := http.NewRequest("POST", "/api/v1/logout", bytes.NewBuffer(jsonValue))
	req.AddCookie(&http.Cookie{
		Name:     "session_token",
		Value:    testSessionToken,
		Path:     "/",
		Domain:   "localhost",
		Expires:  time.Now().Add(time.Hour),
		Secure:   false,
		HttpOnly: true,
	})
	req.Header.Add("X-CSRF-Token", testCSRFToken)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	mockResponse := `{"message":"Logout successful"}`
	responseData, _ := io.ReadAll(w.Body)
	assert.Equal(t, mockResponse, string(responseData))
	assert.Equal(t, http.StatusOK, w.Code)
}

func TestLogin(t *testing.T) {
	err := connectDatabase()
	checkErr(err)
	r := SetUpRouter()

	user := models.User{
		Username: "saul",
		Password: "Money123",
	}

	jsonValue, _ := json.Marshal(user)
	req, _ := http.NewRequest("POST", "/api/v1/login", bytes.NewBuffer(jsonValue))

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	cookies := w.Result().Cookies()
	testSessionToken = cookies[0].Value[:len(cookies[0].Value)-3] + "="
	testCSRFToken = cookies[1].Value[:len(cookies[1].Value)-3] + "="

	mockResponse := `{"message":"Login successful"}`
	responseData, _ := io.ReadAll(w.Body)
	assert.Equal(t, mockResponse, string(responseData))
	assert.Equal(t, http.StatusOK, w.Code)
}

func TestUpdateUser(t *testing.T) {
	err := connectDatabase()
	checkErr(err)
	r := SetUpRouter()

	type UpdateRequest struct {
		CurrentPassword string `json:"currentPassword"`
		NewUsername     string `json:"username"`
		NewEmail        string `json:"email"`
		NewPassword     string `json:"newPassword"`
	}

	var user models.User
	updateReq := UpdateRequest{
		CurrentPassword: "Money123",
		NewEmail:        "updated@test.com",
		NewUsername:     "saul",
		NewPassword:     "Lawyering",
	}

	jsonValue, _ := json.Marshal(updateReq)
	req, _ := http.NewRequest("PUT", "/api/v1/user", bytes.NewBuffer(jsonValue))
	req.AddCookie(&http.Cookie{
		Name:     "session_token",
		Value:    testSessionToken,
		Path:     "/",
		Domain:   "localhost",
		Expires:  time.Now().Add(time.Hour),
		Secure:   false,
		HttpOnly: true,
	})
	req.Header.Add("X-CSRF-Token", testCSRFToken)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	response := w.Body.String()[8 : len(w.Body.String())-1]
	json.Unmarshal([]byte(response), &user)

	assert.Equal(t, updateReq.NewEmail, user.Email)
	assert.Equal(t, updateReq.NewUsername, user.Username)
	assert.Equal(t, http.StatusOK, w.Code)
}

func TestGetCurrentUser(t *testing.T) {
	err := connectDatabase()
	checkErr(err)
	r := SetUpRouter()

	req, _ := http.NewRequest("GET", "/api/v1/current-user", nil)
	req.AddCookie(&http.Cookie{
		Name:     "session_token",
		Value:    testSessionToken,
		Path:     "/",
		Domain:   "localhost",
		Expires:  time.Now().Add(time.Hour),
		Secure:   false,
		HttpOnly: true,
	})
	req.Header.Add("X-CSRF-Token", testCSRFToken)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	mockResponse := `{"username":"saul"}`
	responseData, _ := io.ReadAll(w.Body)
	assert.Equal(t, mockResponse, string(responseData))
	assert.Equal(t, http.StatusOK, w.Code)
}

func TestInitializeLesson(t *testing.T) {
	err := connectDatabase()
	checkErr(err)
	r := SetUpRouter()

	req, _ := http.NewRequest("PUT", "/api/v1/initialize-lesson/1", nil)
	req.AddCookie(&http.Cookie{
		Name:     "session_token",
		Value:    testSessionToken,
		Path:     "/",
		Domain:   "localhost",
		Expires:  time.Now().Add(time.Hour),
		Secure:   false,
		HttpOnly: true,
	})
	req.Header.Add("X-CSRF-Token", testCSRFToken)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "message")
}

func TestGetNextTerm(t *testing.T) {
	err := connectDatabase()
	checkErr(err)
	r := SetUpRouter()

	req, _ := http.NewRequest("GET", "/api/v1/term/1", nil)
	req.AddCookie(&http.Cookie{
		Name:     "session_token",
		Value:    testSessionToken,
		Path:     "/",
		Domain:   "localhost",
		Expires:  time.Now().Add(time.Hour),
		Secure:   false,
		HttpOnly: true,
	})
	req.Header.Add("X-CSRF-Token", testCSRFToken)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "data")
}

func TestGetQuestionTerms(t *testing.T) {
	err := connectDatabase()
	checkErr(err)
	r := SetUpRouter()

	req, _ := http.NewRequest("GET", "/api/v1/term/1", nil)
	req.AddCookie(&http.Cookie{
		Name:     "session_token",
		Value:    testSessionToken,
		Path:     "/",
		Domain:   "localhost",
		Expires:  time.Now().Add(time.Hour),
		Secure:   false,
		HttpOnly: true,
	})
	req.Header.Add("X-CSRF-Token", testCSRFToken)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	var termResp map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &termResp)
	termId := termResp["data"].(map[string]interface{})["term_id"].(float64)

	req, _ = http.NewRequest("GET", "/api/v1/question-terms/"+strconv.FormatFloat(termId, 'f', -1, 64), nil)
	req.AddCookie(&http.Cookie{
		Name:     "session_token",
		Value:    testSessionToken,
		Path:     "/",
		Domain:   "localhost",
		Expires:  time.Now().Add(time.Hour),
		Secure:   false,
		HttpOnly: true,
	})
	req.Header.Add("X-CSRF-Token", testCSRFToken)
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "term")
	assert.Contains(t, w.Body.String(), "choices")
}

func TestGetTermCount(t *testing.T) {
	err := connectDatabase()
	checkErr(err)
	r := SetUpRouter()

	req, _ := http.NewRequest("GET", "/api/v1/term-count/1", nil)
	req.AddCookie(&http.Cookie{
		Name:     "session_token",
		Value:    testSessionToken,
		Path:     "/",
		Domain:   "localhost",
		Expires:  time.Now().Add(time.Hour),
		Secure:   false,
		HttpOnly: true,
	})
	req.Header.Add("X-CSRF-Token", testCSRFToken)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "count")
}

func TestStudyTerm(t *testing.T) {
	err := connectDatabase()
	checkErr(err)
	r := SetUpRouter()

	type StudyQuery struct {
		TermId   int `json:"term_id"`
		LevelMod int `json:"level_mod"`
	}
	body := StudyQuery{
		TermId:   1,
		LevelMod: -1,
	}

	jsonValue, _ := json.Marshal(body)
	req, _ := http.NewRequest("POST", "/api/v1/study-term", bytes.NewBuffer(jsonValue))
	req.AddCookie(&http.Cookie{
		Name:     "session_token",
		Value:    testSessionToken,
		Path:     "/",
		Domain:   "localhost",
		Expires:  time.Now().Add(time.Hour),
		Secure:   false,
		HttpOnly: true,
	})
	req.Header.Add("X-CSRF-Token", testCSRFToken)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "message")
}

func TestGetGroups(t *testing.T) {
	err := connectDatabase()
	checkErr(err)
	r := SetUpRouter()

	req, _ := http.NewRequest("GET", "/api/v1/group", nil)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "data")
}

func TestCreateGroup(t *testing.T) {
	err := connectDatabase()
	checkErr(err)
	r := SetUpRouter()

	req, _ := http.NewRequest("POST", "/api/v1/unite/test-group", nil)
	req.AddCookie(&http.Cookie{
		Name:     "session_token",
		Value:    testSessionToken,
		Path:     "/",
		Domain:   "localhost",
		Expires:  time.Now().Add(time.Hour),
		Secure:   false,
		HttpOnly: true,
	})
	req.Header.Add("X-CSRF-Token", testCSRFToken)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)
	assert.Contains(t, w.Body.String(), "message")
}

func TestLookupGroup(t *testing.T) {
	err := connectDatabase()
	checkErr(err)
	r := SetUpRouter()

	req, _ := http.NewRequest("GET", "/api/v1/lookup", nil)
	req.AddCookie(&http.Cookie{
		Name:     "session_token",
		Value:    testSessionToken,
		Path:     "/",
		Domain:   "localhost",
		Expires:  time.Now().Add(time.Hour),
		Secure:   false,
		HttpOnly: true,
	})
	req.Header.Add("X-CSRF-Token", testCSRFToken)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "username")
	assert.Contains(t, w.Body.String(), "data")
}

func TestInviteGroup(t *testing.T) {
	err := connectDatabase()
	checkErr(err)
	r := SetUpRouter()

	req, _ := http.NewRequest("PUT", "/api/v1/invite", nil)
	req.AddCookie(&http.Cookie{
		Name:     "session_token",
		Value:    testSessionToken,
		Path:     "/",
		Domain:   "localhost",
		Expires:  time.Now().Add(time.Hour),
		Secure:   false,
		HttpOnly: true,
	})
	req.Header.Add("X-CSRF-Token", testCSRFToken)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)
	assert.Contains(t, w.Body.String(), "message")
}

func TestGetPoints(t *testing.T) {
	err := connectDatabase()
	checkErr(err)
	r := SetUpRouter()

	req, _ := http.NewRequest("GET", "/api/v1/points", nil)
	req.AddCookie(&http.Cookie{
		Name:     "session_token",
		Value:    testSessionToken,
		Path:     "/",
		Domain:   "localhost",
		Expires:  time.Now().Add(time.Hour),
		Secure:   false,
		HttpOnly: true,
	})
	req.Header.Add("X-CSRF-Token", testCSRFToken)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "data")
}

func TestDisbandGroup(t *testing.T) {
	err := connectDatabase()
	checkErr(err)
	r := SetUpRouter()

	req, _ := http.NewRequest("DELETE", "/api/v1/disband", nil)
	req.AddCookie(&http.Cookie{
		Name:     "session_token",
		Value:    testSessionToken,
		Path:     "/",
		Domain:   "localhost",
		Expires:  time.Now().Add(time.Hour),
		Secure:   false,
		HttpOnly: true,
	})
	req.Header.Add("X-CSRF-Token", testCSRFToken)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "message")
}

func TestDeleteUser(t *testing.T) {
	err := connectDatabase()
	checkErr(err)
	r := SetUpRouter()

	user := models.User{
		Username: "saul",
	}

	jsonValue, _ := json.Marshal(user)
	req, _ := http.NewRequest("DELETE", "/api/v1/user", bytes.NewBuffer(jsonValue))
	req.AddCookie(&http.Cookie{
		Name:     "session_token",
		Value:    testSessionToken,
		Path:     "/",
		Domain:   "localhost",
		Expires:  time.Now().Add(time.Hour),
		Secure:   false,
		HttpOnly: true,
	})
	req.Header.Add("X-CSRF-Token", testCSRFToken)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	mockResponse := `{"message":"User deleted successfully"}`
	responseData, _ := io.ReadAll(w.Body)
	assert.Equal(t, mockResponse, string(responseData))
	assert.Equal(t, http.StatusOK, w.Code)
}
