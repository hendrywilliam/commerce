package middlewares

import (
	"fmt"
	"log/slog"
	"net/http"

	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
	"github.com/hendrywilliam/commerce/internal/utils"
)

func NewVerifyCookieMiddleware(cfg *utils.AppConfig, log *slog.Logger) fiber.Handler {
	// Retains outer scope data (cfg).
	return func(c fiber.Ctx) error {
		cookie := c.Cookies("token")
		token, err := jwt.Parse(cookie, func(t *jwt.Token) (interface{}, error) {
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
			}
			return []byte(cfg.SymmetricKey), nil
		})
		if err != nil {
			log.Error(err.Error())
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"message": err.Error(),
			})
		}
		var (
			claims jwt.MapClaims
			ok     bool
		)
		if claims, ok = token.Claims.(jwt.MapClaims); !ok {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
				"message": "Failed to verify user.",
			})
		}
		// Idk why claims.GetSubject is failing.
		subject := claims["sub"]
		c.Locals("user_id", subject)
		email := claims["email"]
		c.Locals("email", email)
		return c.Next()
	}
}
