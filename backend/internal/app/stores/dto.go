package stores

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

type DeleteStoreRequest struct {
	ID uint64 `query:"id" validate:"required"`
}

type DeleteStoreResponse struct {
	Name string `json:"name"`
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
