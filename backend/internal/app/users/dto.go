package users

type CreateUserRequest struct {
	Email           string `json:"email" validate:"required,email"`
	Password        string `json:"password" validate:"required"`
	ConfirmPassword string `json:"confirm_password" validate:"required,eqfield=Password"`
}

type UpdateUserRequest struct {
	ID              uint64      `json:"id" validate:"required"`
	Email           *string     `json:"email"`
	Password        *string     `json:"password"`
	PrivateMetadata interface{} `json:"private_metadata"`
}
