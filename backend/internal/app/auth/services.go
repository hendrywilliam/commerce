package auth

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/hendrywilliam/commerce/internal/queries"
	"github.com/hendrywilliam/commerce/internal/utils"
)

type Authenticator interface {
	Authenticate(credentials map[string]interface{}, privateKey string) (string, error)
}

type EmailPasswordAuthenticator struct{}

func (e *EmailPasswordAuthenticator) Authenticate(credentials map[string]interface{}, privateKey string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"exp":   time.Now().Unix() + 60*60,
		"email": credentials["email"],
		"id":    credentials["id"],
	})
	// @TODO: change using RSA sub-families with asymmetric key.
	signedToken, err := token.SignedString([]byte(privateKey))
	if err != nil {
		return "", nil
	}
	return signedToken, nil
}

type GoogleOAuthAuthenticator struct{}

func (g *GoogleOAuthAuthenticator) Authenticate(credentials map[string]interface{}, privateKey string) (string, error) {
	return "", nil
}

func GetAuthenticator(method string) Authenticator {
	switch method {
	case "email":
		return &EmailPasswordAuthenticator{}
	case "google":
		return &GoogleOAuthAuthenticator{}
	default:
		return nil
	}
}

type AuthServices interface {
	Login(ctx context.Context, args LoginRequest, cfg *utils.AppConfig) (LoginResponse, error)
	// Register(ctx context.Context, args )
}

type AuthServicesImpl struct {
	Q *queries.Queries
}

func NewServices(q *queries.Queries) AuthServices {
	return &AuthServicesImpl{
		Q: q,
	}
}

func (as *AuthServicesImpl) Login(ctx context.Context, args LoginRequest, cfg *utils.AppConfig) (LoginResponse, error) {
	authenticator := GetAuthenticator(args.Method)
	switch args.Method {
	case "email":
		user, err := as.Q.UserQueries.GetUser(ctx, args.Credentials["email"])
		if err != nil {
			if errors.Is(err, sql.ErrNoRows) {
				return LoginResponse{}, queries.ErrUserNotFound
			}
			return LoginResponse{}, err
		}
		credentials := make(map[string]interface{})
		credentials["email"] = user.Email
		credentials["id"] = user.ID
		token, err := authenticator.Authenticate(credentials, cfg.SymmetricKey)
		if err != nil {
			return LoginResponse{}, err
		}
		return LoginResponse{Token: token}, nil
	case "google":
		return LoginResponse{}, errors.New("not implemented yet.")
	default:
		return LoginResponse{}, errors.New("login method is not allowed.")
	}
}
