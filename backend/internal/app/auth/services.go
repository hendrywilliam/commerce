package auth

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/hendrywilliam/commerce/internal/queries"
	"github.com/hendrywilliam/commerce/internal/utils"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

type AuthServices interface {
	Login(ctx context.Context, args LoginRequest) (LoginResponse, error)
	OAuthLogin(ctx context.Context) string
	OAuthCallback(ctx context.Context, authorizationCode string) (*oauth2.Token, error)
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
			"https://www.googleapis.com/auth/userinfo.profile",
		},
	}
}

func (as *AuthServicesImpl) OAuthCallback(ctx context.Context, code string) (*oauth2.Token, error) {
	oauth := configGoogle(as.Config)
	token, err := oauth.Exchange(ctx, code)
	if err != nil {
		return nil, err
	}
	return token, nil
}

func (as *AuthServicesImpl) OAuthLogin(ctx context.Context) string {
	oauth := configGoogle(as.Config)
	url := oauth.AuthCodeURL(as.Config.GoogleOauthState)
	return url
}

func (as *AuthServicesImpl) Login(ctx context.Context,  args LoginRequest) (LoginResponse, error) {
	user, err := as.Q.UserQueries.GetUser(ctx, args.Email)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return LoginResponse{}, queries.ErrUserNotFound
		}
		return LoginResponse{}, err
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"exp":   time.Now().Unix() + 60*60,
		"email": user.Email,
		"id":    user.ID,
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
