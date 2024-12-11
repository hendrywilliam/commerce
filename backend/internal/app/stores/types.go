package stores

import "time"

type Store struct {
	ID          uint64    `json:"id"`
	Name        string    `json:"name"`
	Slug        string    `json:"slug"`
	Description string    `json:"description"`
	Active      bool      `json:"active"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type CreateStoreRequest struct {
	Name        string `json:"name" validate:"required"`
	Slug        string `json:"slug" validate:"required"`
	Description string `json:"description" validate:"required"`
	Active      bool   `json:"active" validate:"required"`
}

type CreateStoreResponse struct {
	ID   uint64 `json:"id"`
	Name string `json:"name"`
}

type CreateStoreArgs struct {
	Name        string
	Slug        string
	Description string
	Active      bool
}

type DeleteStoreRequest struct {
	ID uint64 `query:"id" validate:"required"`
}

type DeleteStoreResponse struct {
	Name string `json:"name"`
}

type DeleteStoreArgs struct {
	ID uint64 `json:"id"`
}

type UpdateStoreRequest struct {
	ID          uint64 `json:"id" validate:"required"`
	Name        string `json:"name" validate:"required"`
	Slug        string `json:"slug" validate:"required"`
	Description string `json:"description" validate:"required"`
	Active      bool   `json:"active" validate:"required"`
}

type UpdateStoreResponse struct {
	Name string `json:"name"`
}

type UpdateStoreArgs struct {
	ID          uint64
	Name        string
	Slug        string
	Description string
	Active      bool
}
