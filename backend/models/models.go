package models

type User struct {
	Email        string `json:"email"`
	Username     string `json:"username"`
	Password     string `json:"password"`
	SessionToken string `json:"session_token"`
	CSRFToken    string `json:"csrf_token"`
}
