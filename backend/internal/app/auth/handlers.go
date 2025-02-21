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
	OAuthLogin(c fiber.Ctx) error
	OAuthCallback(c fiber.Ctx) error
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

func (ah *AuthHandlersImpl) OAuthLogin(c fiber.Ctx) error {
	url := ah.Services.OAuthLogin(c.Context())
	return c.Redirect().To(url)
}

func (ah *AuthHandlersImpl) OAuthCallback(c fiber.Ctx) error {
	var (
		state      = c.Query("state")
		errorState = c.Query("error")
		code       = c.Query("code")
	)
	if state != ah.Config.GoogleOauthState || errorState != "" || code == "" {
		return c.Send([]byte("error occured. please try again later."))
	}
	token, err := ah.Services.OAuthCallback(c.Context(), code)
	if err != nil {
		return c.Send([]byte("error occured. please try again later."))
	}
	cookie := &fiber.Cookie{
		Name: "token",
		HTTPOnly: true,
		Secure: false,
	}
	if jwt, ok := token.Extra("id_token").(string); ok {
		cookie.Value = jwt
	}
	c.Cookie(cookie)
	return c.Redirect().To(ah.Config.FrontendUrl + "/sign-in")
}

func (ah *AuthHandlersImpl) Login(c fiber.Ctx) error {
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
				"message": utils.ErrTooManyRequest.Error(),
			},
		})
	}
	var req LoginRequest
	if err := c.Bind().Body(&req); err != nil {
		if e, ok := err.(validator.ValidationErrors); ok {
			err := utils.DigestValErrors(e)
			ah.Redis.Set(c.Context(), "rate:"+c.IP(), limit, 0)
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"error": fiber.Map{
					"code":    http.StatusBadRequest,
					"message": utils.ErrValidationFailed.Error(),
					"details": err,
					"attempt": limit,
				},
			})
		}
		ah.Redis.Set(c.Context(), "rate:"+c.IP(), limit, 0)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": fiber.Map{
				"code":    http.StatusInternalServerError,
				"message": err.Error(),
				"attempt": limit,
			},
		})
	}
	data, err := ah.Services.Login(c.Context(), req)
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
	cookie := &fiber.Cookie{
		Name:  "token",
		Value: data.Token,
	}
	c.Cookie(cookie)
	return c.Status(http.StatusOK).JSON(fiber.Map{
		"data": fiber.Map{
			"message": "Login succeeded.",
		},
	})
}

func (ah *AuthHandlersImpl) Register(c fiber.Ctx) error {
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
				"message": utils.ErrTooManyRequest.Error(),
			},
		})
	}
	var req RegisterRequest
	if err := c.Bind().Body(&req); err != nil {
		if e, ok := err.(validator.ValidationErrors); ok {
			err := utils.DigestValErrors(e)
			ah.Redis.Set(c.Context(), "rate:"+c.IP(), limit, 0)
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"error": fiber.Map{
					"code":    http.StatusBadRequest,
					"message": utils.ErrValidationFailed.Error(),
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
			"message": "User created. You may login now.",
		},
	})
}
