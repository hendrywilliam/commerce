package auth

type LoginRequest struct {
	Method      string            `json:"method" validate:"required"`
	Credentials map[string]string `json:"credentials" validate:"required"`
}

type LoginResponse struct {
	Token string
	Data  map[string]interface{}
}
