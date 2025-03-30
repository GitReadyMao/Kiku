package main

import (
	"crypto/rand"
	"encoding/base64"
	"log"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gshare.com/platform/models"
)

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	return string(bytes), err
}

func checkPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func generateToken(length int) string {
	bytes := make([]byte, length)
	if _, err := rand.Read(bytes); err != nil {
		log.Fatalf("Failed to generate token: %v", err)
	}
	return base64.URLEncoding.EncodeToString(bytes)
}

func getUsername(c *gin.Context) string {
	st, err := c.Cookie("session_token")
	if err != nil || st == "" {
		return ""
	}

	var user models.User
	if db.First(&user, "session_token = ?", st).Error != nil {
		return ""
	}

	return user.Username
}

func getSRSTime(level int) time.Time {
	return time.Now().Add(time.Minute * time.Duration(level*6))
}
