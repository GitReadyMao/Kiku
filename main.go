package main

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type User struct {
	Username string
	Password string
	EMail    string
}

type Terms struct {
	TermId     uint
	Hiragana   string
	Katakana   *string
	Kanji      *string
	Definition string
	Lesson     string
}

type Groups struct {
	GroupName   string
	LeaderName  string
	Member2Name *string
	Member3Name *string
	Member4Name *string
}

// Adjusting site database using GROM tutorial/documentation
func main() {
	db, err := gorm.Open(sqlite.Open("kiku.db"), &gorm.Config{})

	if err != nil {
		panic("failed to connect database")
	}

	// Migrate the schema
	db.AutoMigrate(&User{}, &Terms{}, &Groups{})

	// Create
	term := "聞く"
	var kanji *string = &term
	db.Create(&Terms{TermId: 1, Hiragana: "きく", Katakana: nil, Kanji: kanji, Definition: "To listen", Lesson: "Verbs"})

	// Read
	var terms Terms
	db.First(&terms, 1)
}
