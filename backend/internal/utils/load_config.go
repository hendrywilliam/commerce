package utils

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type AppConfig struct {
	DatabaseURL string
}

func LoadConfiguration() *AppConfig {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("error loading .env file")
	}
	return &AppConfig{
		DatabaseURL: os.Getenv("DATABASE_URL"),
	}
}
