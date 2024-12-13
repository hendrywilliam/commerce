package stores

import (
	"fmt"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v3"
	"github.com/hendrywilliam/commerce/internal/utils"
)

type StoreHandlers interface {
	CreateStore(c fiber.Ctx) error
	DeleteStore(c fiber.Ctx) error
	UpdateStore(c fiber.Ctx) error
}

type StoreHandlersImpl struct {
	Services StoreServices
}

func NewHandlers(services StoreServices) StoreHandlers {
	return &StoreHandlersImpl{
		Services: services,
	}
}

func (sh *StoreHandlersImpl) CreateStore(c fiber.Ctx) error {
	var req CreateStoreRequest
	if err := c.Bind().Body(&req); err != nil {
		if e, ok := err.(validator.ValidationErrors); ok {
			err := utils.DigestValidationErrors(e)
			return c.Status(http.StatusBadRequest).JSON(utils.ErrorResponse(utils.ResponseDetails{
				Info: utils.InfoDetails{
					Message: "Failed to validate.",
				},
				Errors: err,
			}))
		}
		return c.Status(http.StatusInternalServerError).JSON(utils.ErrorResponse(utils.ResponseDetails{
			Info: utils.InfoDetails{
				Message: utils.ErrInternalError.Error(),
			},
		}))
	}
	store, err := sh.Services.CreateStore(c.Context(), req)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(utils.ErrorResponse(utils.ResponseDetails{
			Info: utils.InfoDetails{
				Message: "Failed to create a new store.",
				Reason:  err.Error(),
			},
		}))
	}
	return c.Status(http.StatusCreated).JSON(utils.SuccessResponse(utils.ResponseDetails{
		Info: utils.InfoDetails{
			Message: fmt.Sprintf("%v store created.", store.Name),
		},
	}))
}

func (sh *StoreHandlersImpl) DeleteStore(c fiber.Ctx) error {
	var req DeleteStoreRequest
	if err := c.Bind().Query(&req); err != nil {
		if e, ok := err.(validator.ValidationErrors); ok {
			err := utils.DigestValidationErrors(e)
			return c.Status(http.StatusBadRequest).JSON(utils.ErrorResponse(utils.ResponseDetails{
				Info: utils.InfoDetails{
					Message: "Failed to validate.",
				},
				Errors: err,
			}))
		}
		return c.Status(http.StatusInternalServerError).JSON(utils.ErrorResponse(utils.ResponseDetails{
			Info: utils.InfoDetails{
				Message: utils.ErrInternalError.Error(),
			},
		}))
	}
	storeName, err := sh.Services.DeleteStore(c.Context(), req)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(utils.ErrorResponse(utils.ResponseDetails{
			Info: utils.InfoDetails{
				Message: "Failed to delete a store.",
				Reason:  err.Error(),
			},
		}))
	}
	return c.Status(http.StatusOK).JSON(utils.SuccessResponse(utils.ResponseDetails{
		Info: utils.InfoDetails{
			Message: fmt.Sprintf("%v store deleted.", storeName),
		},
	}))
}

func (sh *StoreHandlersImpl) UpdateStore(c fiber.Ctx) error {
	var req UpdateStoreRequest
	if err := c.Bind().Body(&req); err != nil {
		if e, ok := err.(validator.ValidationErrors); ok {
			err := utils.DigestValidationErrors(e)
			return c.Status(http.StatusBadRequest).JSON(utils.ErrorResponse(utils.ResponseDetails{
				Info: utils.InfoDetails{
					Message: "Failed to validate.",
				},
				Errors: err,
			}))
		}
		return c.Status(http.StatusInternalServerError).JSON(utils.ErrorResponse(utils.ResponseDetails{
			Info: utils.InfoDetails{
				Message: utils.ErrInternalError.Error(),
			},
		}))
	}
	storeName, err := sh.Services.UpdateStore(c.Context(), req)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(utils.ErrorResponse(utils.ResponseDetails{
			Info: utils.InfoDetails{
				Message: "Faiked to update a store.",
				Reason:  err.Error(),
			},
		}))
	}
	return c.Status(http.StatusOK).JSON(utils.SuccessResponse(utils.ResponseDetails{
		Info: utils.InfoDetails{
			Message: fmt.Sprintf("%v store updated,", storeName),
		},
	}))
}
