package users

import (
	"log/slog"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v3"
	"github.com/hendrywilliam/commerce/internal/utils"
)

type UsersHandlers interface {
	GetUser(c fiber.Ctx) error
	UpdateUser(c fiber.Ctx) error
}

type UsersHandlersImpl struct {
	Services UserServices
	Log      *slog.Logger
}

func NewHandlers(services UserServices, log *slog.Logger) UsersHandlers {
	return &UsersHandlersImpl{
		Services: services,
		Log:      log,
	}
}

func (uh *UsersHandlersImpl) GetUser(c fiber.Ctx) error {
	var req GetUserRequest
	if err := c.Bind().Body(&req); err != nil {
		if e, ok := err.(validator.ValidationErrors); ok {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"errors": utils.DigestValErrors(e),
			})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": utils.ErrInternalError.Error(),
		})
	}
	user, err := uh.Services.GetUser(c.Context(), req)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"info":    "failed to find user",
			"message": err.Error(),
		})
	}
	return c.Status(http.StatusOK).JSON(fiber.Map{
		"data": user,
	})
}

func (uh *UsersHandlersImpl) UpdateUser(c fiber.Ctx) error {
	var req UpdateUserRequest
	if err := c.Bind().Body(&req); err != nil {
		if e, ok := err.(validator.ValidationErrors); ok {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"errors": utils.DigestValErrors(e),
			})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": utils.ErrInternalError.Error(),
		})
	}
	_, err := uh.Services.UpdateUser(c.Context(), req)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": err.Error(),
		})
	}
	return c.Status(http.StatusOK).JSON(fiber.Map{
		"message": "user updated.",
	})
}
