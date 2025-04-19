package models

import "time"

type User struct {
	Email        string `json:"email"`
	Username     string `json:"username"`
	Password     string `json:"password"`
	SessionToken string `json:"session_token"`
	CSRFToken    string `json:"csrf_token"`
}

type Term struct {
	Id         int    `json:"id"`
	Hiragana   string `json:"hiragana"`
	Kanji      string `json:"kanji"`
	Definition string `json:"definition"`
	Lesson     int    `json:"lesson"`
	GroupId    int    `json:"group_id"`
}

type Studies struct {
	Username  string    `json:"username"`
	TermId    int       `json:"term_id"`
	Level     int       `json:"level"`
	StudyTime time.Time `json:"study_time"`
}
