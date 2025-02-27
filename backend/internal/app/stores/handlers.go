package stores

import (
	"fmt"
	"log/slog"
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
	Log      *slog.Logger
}

func NewHandlers(services StoreServices, log *slog.Logger) StoreHandlers {
	return &StoreHandlersImpl{
		Services: services,
		Log:      log,
	}
}

func (sh *StoreHandlersImpl) CreateStore(c fiber.Ctx) error {
	var req CreateStoreRequest
	if err := c.Bind().Body(&req); err != nil {
		if e, ok := err.(validator.ValidationErrors); ok {
			err := utils.DigestValErrors(e)
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"message": "failed to validate",
				"errors":  err,
			})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": utils.ErrInternalError.Error(),
		})
	}
	store, err := sh.Services.CreateStore(c.Context(), req)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": utils.ErrInternalError.Error(),
		})
	}
	return c.Status(http.StatusCreated).JSON(fiber.Map{
		"message": fmt.Sprintf("store '%v' has been created successfully", store.Name),
	})
}

func (sh *StoreHandlersImpl) DeleteStore(c fiber.Ctx) error {
	var req DeleteStoreRequest
	if err := c.Bind().Query(&req); err != nil {
		if e, ok := err.(validator.ValidationErrors); ok {
			err := utils.DigestValErrors(e)
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"message": "failed to validate",
				"errors":  err,
			})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": utils.ErrInternalError.Error(),
		})
	}
	storeName, err := sh.Services.DeleteStore(c.Context(), req)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": utils.ErrInternalError.Error(),
		})
	}
	return c.Status(http.StatusOK).JSON(fiber.Map{
		"message": fmt.Sprintf("store '%v' has been deleted", storeName),
	})
}

func (sh *StoreHandlersImpl) UpdateStore(c fiber.Ctx) error {
	var req UpdateStoreRequest
	if err := c.Bind().Body(&req); err != nil {
		if e, ok := err.(validator.ValidationErrors); ok {
			err := utils.DigestValErrors(e)
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"message": "failed to validate",
				"errors":  err,
			})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": utils.ErrInternalError.Error(),
		})
	}
	store, err := sh.Services.UpdateStore(c.Context(), req)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": utils.ErrInternalError.Error(),
		})
	}
	return c.Status(http.StatusOK).JSON(fiber.Map{
		"message": fmt.Sprintf("store '%v' has been updated", store.Name),
		"data":    store,
	})
}
