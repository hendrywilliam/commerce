package auth

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/coreos/go-oidc/v3/oidc"
	"github.com/golang-jwt/jwt"
	"github.com/hendrywilliam/commerce/internal/queries"
	"github.com/hendrywilliam/commerce/internal/utils"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

type AuthServices interface {
	Login(ctx context.Context, args LoginRequest) (LoginResponse, error)
	OAuthLogin(ctx context.Context, state string) string
	OAuthCallback(ctx context.Context, authCode string, oauthClientID string) (LoginResponse, error)
	Register(ctx context.Context, args RegisterRequest) (string, error)
}

type AuthServicesImpl struct {
	Q      *queries.Queries
	Config *utils.AppConfig
}

func NewServices(q *queries.Queries, cfg *utils.AppConfig) AuthServices {
	return &AuthServicesImpl{
		Q:      q,
		Config: cfg,
	}
}

func configGoogle(cfg *utils.AppConfig) *oauth2.Config {
	return &oauth2.Config{
		ClientID:     cfg.GoogleOauthClientID,
		ClientSecret: cfg.GoogleOauthClientSecret,
		RedirectURL:  cfg.GoogleOauthRedirectUri,
		Endpoint:     google.Endpoint,
		Scopes: []string{
			"openid",
			"email",
			"profile",
		},
	}
}

func googleOidcProvider(ctx context.Context) (*oidc.Provider, error) {
	provider, err := oidc.NewProvider(ctx, "https://accounts.google.com")
	if err != nil {
		return nil, err
	}
	return provider, err
}

func (as *AuthServicesImpl) OAuthCallback(ctx context.Context, authCode string, oauthClientID string) (LoginResponse, error) {
	oauth := configGoogle(as.Config)
	token, err := oauth.Exchange(ctx, authCode)
	if err != nil {
		return LoginResponse{}, utils.ErrInternalError
	}
	provider, err := googleOidcProvider(ctx)
	if err != nil {
		return LoginResponse{}, utils.ErrInternalError
	}
	verifier := provider.Verifier(&oidc.Config{ClientID: oauthClientID})
	var (
		rawIdToken string
		ok         bool
		idToken    *oidc.IDToken
	)
	if rawIdToken, ok = token.Extra("id_token").(string); ok {
		idToken, err = verifier.Verify(ctx, rawIdToken)
	}
	var claims OpenIDClaims
	if err := idToken.Claims(&claims); err != nil {
		return LoginResponse{}, utils.ErrInternalError
	}
	// Store user with sub claims from id_token as it is unique to a user.
	user, err := as.Q.UserQueries.CreateUser(ctx, queries.CreateUserArgs{
		Email:    claims.Email,
		Sub:      claims.Subject,
		ImageURL: claims.Picture,
	})
	if err != nil {
		return LoginResponse{}, utils.ErrInternalError
	}
	jwtToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":   user.ID,
		"exp":   time.Now().Unix() + 60*60,
		"iat":   time.Now().Unix(),
		"email": user.Email,
	})
	signedToken, err := jwtToken.SignedString([]byte(as.Config.SymmetricKey))
	if err != nil {
		return LoginResponse{}, utils.ErrInternalError
	}
	return LoginResponse{Token: signedToken}, nil
}

func (as *AuthServicesImpl) OAuthLogin(ctx context.Context, state string) string {
	oauth := configGoogle(as.Config)
	url := oauth.AuthCodeURL(state)
	return url
}

func (as *AuthServicesImpl) Login(ctx context.Context, args LoginRequest) (LoginResponse, error) {
	user, err := as.Q.UserQueries.GetUser(ctx, args.Email)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return LoginResponse{}, queries.ErrUserNotFound
		}
		return LoginResponse{}, err
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"exp":   time.Now().Unix() + 60*60,
		"iat":   time.Now().Unix(),
		"email": user.Email,
		"sub":   user.ID,
	})
	signedToken, err := token.SignedString([]byte(as.Config.SymmetricKey))
	return LoginResponse{Token: signedToken}, nil
}

func (as *AuthServicesImpl) Register(ctx context.Context, args RegisterRequest) (string, error) {
	hashedPassword, err := utils.HashPassword(args.Password)
	if err != nil {
		return "", utils.ErrInternalError
	}
	user, err := as.Q.UserQueries.CreateUser(ctx, queries.CreateUserArgs{
		Email:    args.Email,
		Password: hashedPassword,
	})
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return "", queries.ErrUserAlreadyExist
		}
		return "", utils.ErrInternalError
	}
	return user.Email, nil
}
