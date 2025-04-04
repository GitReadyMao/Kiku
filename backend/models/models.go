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
	Katakana   string `json:"katakana"`
	Definition string `json:"definition"`
	Lesson     int    `json:"lesson"`
}

type Studies struct {
	Username  string    `json:"username"`
	TermId    int       `json:"term_id"`
	Level     int       `json:"level"`
	StudyTime time.Time `json:"study_time"`
}

type Group struct {
	Name        string `json:"name"`
	MemberCount int    `json:"member_count"`
}

type PartOf struct {
	Username  string `json:"username"`
	GroupName string `json:"group_name"`
}

type Tabler interface {
	TableName() string
}

// TableName overrides the table name used by User to `profiles`
func (PartOf) TableName() string {
	return "PartOf"
}
