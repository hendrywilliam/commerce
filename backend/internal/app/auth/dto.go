package auth

type LoginRequest struct {
	Method      string            `json:"method" validate:"required"`
	Credentials map[string]string `json:"credentials" validate:"required"`
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
