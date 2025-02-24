package auth

type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

type LoginResponse struct {
	Token string                 `json:"token"`
	Data  map[string]interface{} `json:"data,omitempty"`
}

type RegisterRequest struct {
	Email           string `json:"email" validate:"required,email"`
	Password        string `json:"password" validate:"required"`
	ConfirmPassword string `json:"confirm_password" validate:"required,eqcsfield=Password"`
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
