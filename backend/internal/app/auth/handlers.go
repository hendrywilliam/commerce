package auth

import (
	"errors"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v3"
	"github.com/hendrywilliam/commerce/internal/utils"
	"github.com/redis/go-redis/v9"
)

type AuthHandlers interface {
	Login(c fiber.Ctx) error
	Register(c fiber.Ctx) error
}

type AuthHandlersImpl struct {
	Redis    *redis.Client
	Config   *utils.AppConfig
	Services AuthServices
}

func NewHandlers(redis *redis.Client, cfg *utils.AppConfig, service AuthServices) AuthHandlers {
	return &AuthHandlersImpl{
		Redis:    redis,
		Config:   cfg,
		Services: service,
	}
}

func (ah *AuthHandlersImpl) Login(c fiber.Ctx) error {
	var req LoginRequest
	limit, err := ah.Redis.Get(c.Context(), "rate:"+c.IP()).Int()
	if errors.Is(err, redis.Nil) {
		limit = 1
	} else {
		limit++
	}
	if limit > ah.Config.MaxLoginAttempts {
		return c.Status(http.StatusTooManyRequests).JSON(fiber.Map{
			"error": fiber.Map{
				"code":    http.StatusTooManyRequests,
				"message": "too many request. please try again later.",
			},
		})
	}
	if err := c.Bind().Body(&req); err != nil {
		if e, ok := err.(validator.ValidationErrors); ok {
			err := utils.DigestValErrors(e)
			ah.Redis.Set(c.Context(), "rate:"+c.IP(), limit, 0)
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"error": fiber.Map{
					"code":    http.StatusBadRequest,
					"message": "failed to validate",
					"details": err,
					"attempt": limit,
				},
			})
		}
		ah.Redis.Set(c.Context(), "rate:"+c.IP(), limit, 0)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": fiber.Map{
				"code":    http.StatusInternalServerError,
				"message": utils.ErrInternalError.Error(),
				"attempt": limit,
			},
		})
	}
	token, err := ah.Services.Login(c.Context(), LoginRequest{Method: req.Method, Credentials: req.Credentials}, ah.Config)
	if err != nil {
		ah.Redis.Set(c.Context(), "rate:"+c.IP(), limit, 0)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": fiber.Map{
				"code":    http.StatusInternalServerError,
				"message": err.Error(),
				"attempt": limit,
			},
		})
	}
	return c.Status(http.StatusOK).JSON(fiber.Map{
		"data": fiber.Map{
			"token": token.Token,
		},
	})
}

func (ah *AuthHandlersImpl) Register(c fiber.Ctx) error {
	var req RegisterRequest
	limit, err := ah.Redis.Get(c.Context(), "rate:"+c.IP()).Int()
	if errors.Is(err, redis.Nil) {
		limit = 1
	} else {
		limit++
	}
	if limit > ah.Config.MaxLoginAttempts {
		return c.Status(http.StatusTooManyRequests).JSON(fiber.Map{
			"error": fiber.Map{
				"code":    http.StatusTooManyRequests,
				"message": "too many request. please try again later.",
			},
		})
	}
	if err := c.Bind().Body(&req); err != nil {
		if e, ok := err.(validator.ValidationErrors); ok {
			err := utils.DigestValErrors(e)
			ah.Redis.Set(c.Context(), "rate:"+c.IP(), limit, 0)
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"error": fiber.Map{
					"code":    http.StatusBadRequest,
					"message": "failed to validate",
					"details": err,
					"attempt": limit,
				},
			})
		}
		ah.Redis.Set(c.Context(), "rate:"+c.IP(), limit, 0)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": fiber.Map{
				"code":    http.StatusInternalServerError,
				"message": utils.ErrInternalError.Error(),
				"attempt": limit,
			},
		})
	}
	email, err := ah.Services.Register(c.Context(), req)
	if err != nil {
		ah.Redis.Set(c.Context(), "rate:"+c.IP(), limit, 0)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": fiber.Map{
				"code":    http.StatusInternalServerError,
				"message": err.Error(),
				"attempt": limit,
			},
		})
	}
	return c.Status(http.StatusCreated).JSON(fiber.Map{
		"data": fiber.Map{
			"email":   email,
			"message": "user created, you may log in now.",
		},
	})
}
