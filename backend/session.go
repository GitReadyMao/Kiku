package main

import (
	"errors"

	"github.com/gin-gonic/gin"
	"gshare.com/platform/models"
)

func Authorize(c *gin.Context) error {

	authError := errors.New("Unauthorized")

	username := getUsername(c)

	// Get the user
	var user models.User
	result := db.First(&user, "username = ?", username)
	if result.Error != nil {
		//log.Println("Authorize error: No such user")
		return errors.New("error: No such user")
	}
	//log.Println("Authorize: found user =", member.Username)

	// Check session token
	st, err := c.Cookie("session_token")
	if err != nil {
		//log.Println("Authorize error: session_token not found in cookies")
		return authError
	}
	//log.Println("Authorize: session_token from cookie =", st)
	if st == "" || st != user.SessionToken {
		//log.Println("Authorize error: session_token does not match")
		return authError
	}

	// Check the CSRF token from the headers
	csrf := c.Request.Header.Get("X-CSRF-Token")
	if csrf != user.CSRFToken || csrf == "" {
		//log.Println("Authorize error: Invalid csrf token")
		return authError
	}
	//log.Println("Authorize: csrf_token from header =", csrf)
	if csrf != user.CSRFToken {
		//log.Println("Authorize error: csrf_token does not match")
		return authError
	}

	// Set the username in the context
	c.Set("username", user.Username)
	//log.Println("Authorize: user authorized successfully")
	return nil
}
