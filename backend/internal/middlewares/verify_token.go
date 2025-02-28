package middlewares

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
	"github.com/hendrywilliam/commerce/internal/utils"
)

func NewVerifyTokenMiddleware(cfg *utils.AppConfig) fiber.Handler {
	// Retains outer scope data (cfg).
	return func(c fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
				"messsage": "Authorization header is missing.",
			})
		}
		spl := strings.Split(authHeader, " ")
		if spl[0] != "Bearer" {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"message": "Unrecognized authentication scheme.",
			})
		}
		token, err := jwt.Parse(spl[1], func(t *jwt.Token) (interface{}, error) {
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
			}
			return []byte(cfg.SymmetricKey), nil
		})
		if err != nil {
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
		// Idk why claims.GetSubject is fail.
		subject := claims["sub"]
		c.Locals("user_id", subject)
		email := claims["email"]
		c.Locals("email", email)
		return c.Next()
	}
}
