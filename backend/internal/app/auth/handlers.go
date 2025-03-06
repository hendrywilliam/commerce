package auth

import (
	"errors"
	"log/slog"
	"net/http"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v3"
	"github.com/hendrywilliam/commerce/internal/utils"
	"github.com/redis/go-redis/v9"
)

type AuthHandlers interface {
	Login(c fiber.Ctx) error
	Register(c fiber.Ctx) error
	OAuthLogin(c fiber.Ctx) error
	OAuthCallback(c fiber.Ctx) error
}

type AuthHandlersImpl struct {
	Redis    *redis.Client
	Config   *utils.AppConfig
	Services AuthServices
	Log      *slog.Logger
}

func NewHandlers(redis *redis.Client, cfg *utils.AppConfig, service AuthServices, log *slog.Logger) AuthHandlers {
	return &AuthHandlersImpl{
		Redis:    redis,
		Config:   cfg,
		Services: service,
		Log:      log,
	}
}

func (ah *AuthHandlersImpl) OAuthLogin(c fiber.Ctx) error {
	persistedState, err := ah.Redis.Get(c.Context(), "state_token").Result()
	if errors.Is(err, redis.Nil) {
		persistedState = utils.GenerateAntiForgeryToken()
		ah.Redis.Set(c.Context(), "state_token", persistedState, time.Duration(time.Hour*24))
	}
	url := ah.Services.OAuthLogin(c.Context(), persistedState)
	return c.Redirect().To(url)
}

func (ah *AuthHandlersImpl) OAuthCallback(c fiber.Ctx) error {
	var (
		state      = c.Query("state")
		errorState = c.Query("error")
		code       = c.Query("code")
	)
	persistedState, err := ah.Redis.Get(c.Context(), "state_token").Result()
	if errors.Is(err, redis.Nil) {
		return c.Send([]byte("error occured. please try again later."))
	}
	if state != persistedState || errorState != "" || code == "" {
		return c.Send([]byte("error occured. please try again later."))
	}
	token, err := ah.Services.OAuthCallback(c.Context(), code, ah.Config.GoogleOauthClientID)
	if err != nil {
		return c.Send([]byte("error occured. please try again later."))
	}
	cookie := &fiber.Cookie{
		Name:     "token",
		HTTPOnly: true,
		Value:    token.Token,
	}
	c.Cookie(cookie)
	return c.Redirect().To(ah.Config.FrontendUrl)
}

func (ah *AuthHandlersImpl) Login(c fiber.Ctx) error {
	var req LoginRequest
	rateLimit, ok := c.Locals("rate_limit").(int)
	if !ok {
		rateLimit = 1
	}
	if err := c.Bind().Body(&req); err != nil {
		if e, ok := err.(validator.ValidationErrors); ok {
			err := utils.DigestValErrors(e)
			ah.Redis.Set(c.Context(), "rate:"+req.Email, rateLimit, ah.Config.LoginRateLimitTTLInMinute)
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"error": fiber.Map{
					"code":    http.StatusBadRequest,
					"message": utils.ErrValidationFailed.Error(),
					"details": err,
					"limit":   rateLimit,
				},
			})
		}
		ah.Redis.Set(c.Context(), "rate:"+req.Email, rateLimit, ah.Config.LoginRateLimitTTLInMinute)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": fiber.Map{
				"code":    http.StatusInternalServerError,
				"message": err.Error(),
				"limit":   rateLimit,
			},
		})
	}
	data, err := ah.Services.Login(c.Context(), req)
	if err != nil {
		ah.Redis.Set(c.Context(), "rate:"+req.Email, rateLimit, ah.Config.LoginRateLimitTTLInMinute)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": fiber.Map{
				"code":    http.StatusInternalServerError,
				"message": err.Error(),
				"limit":   rateLimit,
			},
		})
	}
	cookie := &fiber.Cookie{
		Name:     "token",
		Value:    data.Token,
		HTTPOnly: true,
	}
	c.Cookie(cookie)
	ah.Redis.Del(c.Context(), "rate:"+req.Email)
	return c.Status(http.StatusOK).JSON(fiber.Map{
		"data": fiber.Map{
			"message": "Login succeeded.",
			"data":    data.User,
		},
	})
}

func (ah *AuthHandlersImpl) Register(c fiber.Ctx) error {
	var req RegisterRequest
	rateLimit, ok := c.Locals("rate_limit").(int)
	if !ok {
		rateLimit = 1
	}
	if err := c.Bind().Body(&req); err != nil {
		if e, ok := err.(validator.ValidationErrors); ok {
			err := utils.DigestValErrors(e)
			ah.Redis.Set(c.Context(), "rate:"+c.IP(), rateLimit, 0)
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"error": fiber.Map{
					"code":    http.StatusBadRequest,
					"message": utils.ErrValidationFailed.Error(),
					"details": err,
					"limit":   rateLimit,
				},
			})
		}
		ah.Redis.Set(c.Context(), "rate:"+c.IP(), rateLimit, 0)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": fiber.Map{
				"code":    http.StatusInternalServerError,
				"message": utils.ErrInternalError.Error(),
				"limit":   rateLimit,
			},
		})
	}
	email, err := ah.Services.Register(c.Context(), req)
	if err != nil {
		ah.Redis.Set(c.Context(), "rate:"+c.IP(), rateLimit, 0)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": fiber.Map{
				"code":    http.StatusInternalServerError,
				"message": err.Error(),
				"limit":   rateLimit,
			},
		})
	}
	return c.Status(http.StatusCreated).JSON(fiber.Map{
		"data": fiber.Map{
			"email":   email,
			"message": "User created. You may login now.",
		},
	})
}
