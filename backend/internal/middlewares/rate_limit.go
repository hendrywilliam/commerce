package middlewares

import (
	"errors"
	"net/http"

	"github.com/gofiber/fiber/v3"
	"github.com/hendrywilliam/commerce/internal/utils"
	"github.com/redis/go-redis/v9"
)

func NewRateLimitMiddleware(cfg *utils.AppConfig, redisClient *redis.Client) fiber.Handler {
	return func(c fiber.Ctx) error {
		limit, err := redisClient.Get(c.Context(), "rate:"+c.IP()).Int()
		if errors.Is(err, redis.Nil) {
			limit = 1
		} else {
			limit++
		}
		if limit > cfg.MaxLoginAttempts {
			return c.Status(http.StatusTooManyRequests).JSON(fiber.Map{
				"error": fiber.Map{
					"code":    http.StatusTooManyRequests,
					"message": utils.ErrTooManyRequest.Error(),
				},
			})
		}
		c.Locals("rate_limit", limit)
		return c.Next()
	}
}
