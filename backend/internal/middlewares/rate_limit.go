package middlewares

import (
	"errors"
	"fmt"
	"log/slog"
	"net/http"

	"github.com/gofiber/fiber/v3"
	"github.com/hendrywilliam/commerce/internal/utils"
	"github.com/redis/go-redis/v9"
)

func NewRateLimitMiddleware(cfg *utils.AppConfig, redisClient *redis.Client, log *slog.Logger) fiber.Handler {
	return func(c fiber.Ctx) error {
		var req struct {
			Email string `json:"email"`
		}
		if err := c.Bind().Body(&req); err != nil {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"error": fiber.Map{
					"code":    http.StatusBadRequest,
					"message": "Invalid login credentials",
				},
			})
		}
		redisKey := fmt.Sprintf("rate:%s", req.Email)
		rateLimit, err := redisClient.Get(c.Context(), redisKey).Int()
		if errors.Is(err, redis.Nil) {
			rateLimit = 1
			redisClient.Set(c.Context(), redisKey, rateLimit, cfg.LoginRateLimitTTLInMinute)
		}
		// Other than redis.Nil
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"error": fiber.Map{
					"code":    http.StatusInternalServerError,
					"message": utils.ErrInternalError.Error(),
				},
			})
		}
		rateLimit++
		c.Locals("rate_limit", rateLimit)
		if rateLimit > cfg.MaxLoginAttempts {
			return c.Status(http.StatusTooManyRequests).JSON(fiber.Map{
				"error": fiber.Map{
					"code":    http.StatusTooManyRequests,
					"message": utils.ErrTooManyRequest.Error(),
				},
			})
		}
		return c.Next()
	}
}
