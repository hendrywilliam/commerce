package auth

import "github.com/hendrywilliam/commerce/internal/queries"

type LoginRequest struct {
	AuthenticationType string `json:"authentication_type" validate:"required"`
	Email              string `json:"email" validate:"required,email"`
	Password           string `json:"password" validate:"required"`
}

type LoginResponse struct {
	Token string       `json:"token"`
	User  queries.User `json:"user,omitempty"`
}

type RegisterRequest struct {
	AuthenticationType string `json:"authentication_type" validate:"required"`
	Email              string `json:"email" validate:"required,email"`
	Password           string `json:"password" validate:"required"`
	ConfirmPassword    string `json:"confirm_password" validate:"required,eqcsfield=Password"`
	FullName           string `json:"fullname" validate:"required"`
}

type RegisterResponse struct {
	Email string
}

type OpenIDClaims struct {
	Email            string `json:"email"`
	Verified         bool   `json:"email_verified"`
	Issuer           string `json:"iss"`
	AuthorizedClaims string `json:"azp"`
	Subject          string `json:"sub"`
	AtHash           string `json:"at_hash"`
	Name             string `json:"name"`
	Picture          string `json:"picture"`
	GivenName        string `json:"given_name"`
	FamilyName       string `json:"family_name"`
	IssuedAt         uint   `json:"issued_at"`
	ExpiredAt        uint   `json:"expired_at"`
}
