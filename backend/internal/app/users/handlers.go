package users

import (
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"strconv"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v3"
	"github.com/hendrywilliam/commerce/internal/queries"
	"github.com/hendrywilliam/commerce/internal/utils"
	"github.com/redis/go-redis/v9"
)

type UsersHandlers interface {
	GetUserProfile(c fiber.Ctx) error
	UpdateUser(c fiber.Ctx) error
}

type UsersHandlersImpl struct {
	Services UserServices
	Log      *slog.Logger
	Redis    *redis.Client
}

func NewHandlers(services UserServices, redis *redis.Client, log *slog.Logger) UsersHandlers {
	return &UsersHandlersImpl{
		Services: services,
		Log:      log,
		Redis:    redis,
	}
}

func (uh *UsersHandlersImpl) GetUserProfile(c fiber.Ctx) error {
	userId, ok := c.Locals("user_id").(string)
	if !ok {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"code":    http.StatusInternalServerError,
			"message": utils.ErrInternalError.Error(),
		})
	}
	// Get profile from cache first.
	userByte, err := uh.Redis.Get(c.Context(), fmt.Sprintf("user:%v", userId)).Bytes()
	if errors.Is(err, redis.Nil) {
		userIdInt, err := strconv.Atoi(userId)
		if err != nil {
			uh.Log.Error(err.Error())
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"code":    http.StatusInternalServerError,
				"message": utils.ErrInternalError.Error(),
			})
		}
		user, err := uh.Services.GetUserProfile(c.Context(), userIdInt)
		if err != nil {
			uh.Log.Error(err.Error())
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"code":    http.StatusInternalServerError,
				"message": utils.ErrInternalError.Error(),
			})
		}
		userB, err := json.Marshal(user)
		if err != nil {
			uh.Log.Error(err.Error())
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"code":    http.StatusInternalServerError,
				"message": utils.ErrInternalError.Error(),
			})
		}
		uh.Redis.Set(c.Context(), fmt.Sprintf("user:%v", user.ID), userB, 0)
		return c.Status(http.StatusOK).JSON(fiber.Map{
			"code":    http.StatusOK,
			"message": "user found.",
			"data":    user,
		})
	}
	if err != nil {
		uh.Log.Error(err.Error())
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"code":    http.StatusInternalServerError,
			"message": utils.ErrInternalError.Error(),
		})
	}
	var user queries.User
	if err = json.Unmarshal(userByte, &user); err != nil {
		uh.Log.Error(err.Error())
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"code":    http.StatusInternalServerError,
			"message": utils.ErrInternalError.Error(),
		})
	}
	return c.Status(http.StatusOK).JSON(fiber.Map{
		"data": user,
		"code": http.StatusOK,
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
