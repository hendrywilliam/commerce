package auth

import (
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"net/url"

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
	state := utils.GenerateAntiForgeryToken()
	url := ah.Services.OAuthLogin(c.Context(), state)
	c.Cookie(&fiber.Cookie{
		Name:     "state",
		HTTPOnly: true,
		Secure:   false,
		Value:    state,
		MaxAge:   60 * 10, // 10 minutes.
	})
	return c.Redirect().To(url)
}

func (ah *AuthHandlersImpl) OAuthCallback(c fiber.Ctx) error {
	var (
		stateRequest = c.Query("state")
		errorState   = c.Query("error")
		code         = c.Query("code")
		state        = c.Cookies("state")
		// baseUrl      = url.URL{Host: fmt.Sprintf("%s/", ah.Config.FrontendUrl)}
		loginURL = url.URL{Host: fmt.Sprintf("%s/sign-in", ah.Config.FrontendUrl)}
	)
	if state == "" {
		loginURL.Query().Add("error", "invalid_state")
		return c.Redirect().To(loginURL.String())
	}
	if state != stateRequest || errorState != "" {
		loginURL.Query().Add("error", "access_denied")
		return c.Redirect().To(loginURL.String())
	}
	token, err := ah.Services.OAuthCallback(c.Context(), code, ah.Config.GoogleOauthClientID)
	if err != nil {
		return c.Send([]byte("error occured. please try again later."))
	}
	// Clear "state" cookie after verification.
	utils.ClearCookies(c, "state")
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
			ah.Redis.Set(c.Context(), fmt.Sprintf("rate:%s", req.Email), rateLimit, ah.Config.LoginRateLimitTTLInMinute)
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"code":    http.StatusBadRequest,
				"message": utils.ErrValidationFailed.Error(),
				"error":   err,
				"limit":   rateLimit,
			})
		}
		ah.Redis.Set(c.Context(), fmt.Sprintf("rate:%s", req.Email), rateLimit, ah.Config.LoginRateLimitTTLInMinute)
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
		ah.Redis.Set(c.Context(), fmt.Sprintf("rate:%s", req.Email), rateLimit, ah.Config.LoginRateLimitTTLInMinute)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"code":    http.StatusInternalServerError,
			"message": err.Error(),
			"limit":   rateLimit,
		})
	}
	cookie := &fiber.Cookie{
		Name:     "token",
		Value:    data.Token,
		HTTPOnly: true,
		SameSite: "None",
		Secure:   true,
	}
	c.Cookie(cookie)
	ah.Redis.Del(c.Context(), fmt.Sprintf("rate:%s", req.Email))
	// Store user data in cache for faster profile load.
	b, err := json.Marshal(data.User)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"code":    http.StatusInternalServerError,
			"message": utils.ErrInternalError.Error(),
		})
	}
	ah.Redis.Set(c.Context(), fmt.Sprintf("user:%v", data.User.ID), b, 0)
	return c.Status(http.StatusOK).JSON(fiber.Map{
		"code":    http.StatusOK,
		"message": "Login succeeded.",
		"data":    data.User,
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
		"message": "User created. You may login now.",
		"data": fiber.Map{
			"email": email,
		},
	})
}
