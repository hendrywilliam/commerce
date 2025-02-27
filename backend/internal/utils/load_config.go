package utils

import (
	"log/slog"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type AppConfig struct {
	DatabaseURL             string
	RedisURL                string
	PepperKey               string
	MaxLoginAttempts        int
	SymmetricKey            string
	FrontendUrl             string
	GoogleOauthClientID     string
	GoogleOauthClientSecret string
	GoogleOauthRedirectUri  string
	AppEnv                  string
}

func LoadConfiguration() *AppConfig {
	err := godotenv.Load()
	if err != nil {
		slog.Error(err.Error())
		os.Exit(1)
	}
	maxLogin, err := strconv.Atoi(os.Getenv("MAX_LOGIN_ATTEMPTS"))
	if err != nil {
		slog.Error(err.Error())
		os.Exit(1)
	}
	return &AppConfig{
		DatabaseURL:             os.Getenv("DATABASE_URL"),
		RedisURL:                os.Getenv("REDIS_URL"),
		PepperKey:               os.Getenv("PEPPER_KEY"),
		MaxLoginAttempts:        maxLogin,
		SymmetricKey:            os.Getenv("SYMMETRIC_KEY"),
		FrontendUrl:             os.Getenv("FRONTEND_URL"),
		GoogleOauthClientID:     os.Getenv("GOOGLE_OAUTH_CLIENT_ID"),
		GoogleOauthClientSecret: os.Getenv("GOOGLE_OAUTH_CLIENT_SECRET"),
		GoogleOauthRedirectUri:  os.Getenv("GOOGLE_OAUTH_REDIRECT_URI"),
		AppEnv:                  os.Getenv("APP_ENV"),
	}
}
