package auth

import (
	"context"
	"database/sql"
	"errors"
	"log/slog"
	"slices"
	"strconv"
	"time"

	"github.com/coreos/go-oidc/v3/oidc"
	"github.com/golang-jwt/jwt/v5"
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
	Log    *slog.Logger
}

func NewServices(q *queries.Queries, cfg *utils.AppConfig, log *slog.Logger) AuthServices {
	return &AuthServicesImpl{
		Q:      q,
		Config: cfg,
		Log:    log,
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
		as.Log.Error(err.Error())
		return LoginResponse{}, utils.ErrInternalError
	}
	provider, err := googleOidcProvider(ctx)
	if err != nil {
		as.Log.Error(err.Error())
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
		if err != nil {
			as.Log.Error(err.Error())
			return LoginResponse{}, err
		}
	}
	var claims OpenIDClaims
	if err := idToken.Claims(&claims); err != nil {
		as.Log.Error(err.Error())
		return LoginResponse{}, utils.ErrInternalError
	}
	// Store user with sub claims from id_token as it is unique to a user.
	user, err := as.Q.UserQueries.CreateUser(ctx, queries.CreateUserArgs{
		Email:              claims.Email,
		Sub:                claims.Subject,
		ImageURL:           claims.Picture,
		Name:               claims.Name,
		AuthenticationType: "GOOGLE",
	})
	if err != nil {
		as.Log.Error(err.Error())
		return LoginResponse{}, utils.ErrInternalError
	}
	jwtToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":   user.ID,
		"exp":   time.Now().Add(time.Hour * 24).Unix(),
		"iat":   time.Now().Unix(),
		"email": user.Email,
	})
	signedToken, err := jwtToken.SignedString([]byte(as.Config.SymmetricKey))
	if err != nil {
		as.Log.Error(err.Error())
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
	if !slices.Contains(as.Config.AllowedAuthenticationTypes, args.AuthenticationType) {
		return LoginResponse{}, errors.New("invalid login credentials")
	}
	user, err := as.Q.UserQueries.GetUserWithEmail(ctx, args.Email)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return LoginResponse{}, queries.ErrUserNotFound
		}
		as.Log.Error(err.Error())
		return LoginResponse{}, err
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"exp":   time.Now().Add(time.Hour * 24).Unix(),
		"iat":   time.Now().Unix(),
		"email": user.Email,
		"sub":   strconv.Itoa(user.ID),
	})
	signedToken, err := token.SignedString([]byte(as.Config.SymmetricKey))
	if err != nil {
		as.Log.Error(err.Error())
		return LoginResponse{}, nil
	}
	return LoginResponse{Token: signedToken, User: user}, nil
}

func (as *AuthServicesImpl) Register(ctx context.Context, args RegisterRequest) (string, error) {
	if !slices.Contains(as.Config.AllowedAuthenticationTypes, args.AuthenticationType) {
		return "", errors.New("invalid login credentials")
	}
	hashedPassword, err := utils.HashPassword(args.Password)
	if err != nil {
		as.Log.Error(err.Error())
		return "", utils.ErrInternalError
	}
	user, err := as.Q.UserQueries.CreateUser(ctx, queries.CreateUserArgs{
		Email:              args.Email,
		Password:           hashedPassword,
		Name:               args.FullName,
		AuthenticationType: "REGISTRATION",
	})
	if err != nil {
		as.Log.Error(err.Error())
		if errors.Is(err, sql.ErrNoRows) {
			return "", queries.ErrUserAlreadyExist
		}
		return "", utils.ErrInternalError
	}
	return user.Email, nil
}
