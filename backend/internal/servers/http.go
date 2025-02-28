package servers

import (
	"context"
	"log/slog"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/hendrywilliam/commerce/internal/app/auth"
	"github.com/hendrywilliam/commerce/internal/app/carts"
	"github.com/hendrywilliam/commerce/internal/app/products"
	"github.com/hendrywilliam/commerce/internal/app/stores"
	"github.com/hendrywilliam/commerce/internal/app/users"
	"github.com/hendrywilliam/commerce/internal/middlewares"
	"github.com/hendrywilliam/commerce/internal/queries"
	"github.com/hendrywilliam/commerce/internal/utils"
	"github.com/redis/go-redis/v9"

	"github.com/jackc/pgx/v5/pgxpool"
)

func ServeHTTP(ctx context.Context, db *pgxpool.Pool, log *slog.Logger, redis *redis.Client, config *utils.AppConfig) error {
	app := fiber.New(fiber.Config{
		StructValidator: &utils.StructValidator{Validator: validator.New(validator.WithRequiredStructEnabled())},
	})
	app.Use(cors.New())
	rg := app.Group("/v1")
	allqs := queries.NewQueries(db)

	productsServices := products.NewServices(&allqs, log)
	storesServices := stores.NewServices(&allqs, log)
	cartsServices := carts.NewServices(&allqs, log)
	usersServices := users.NewServices(&allqs, log)
	authServices := auth.NewServices(&allqs, config, log)

	productsHandlers := products.NewHandlers(productsServices, log)
	storesHandlers := stores.NewHandlers(storesServices, log)
	cartsHandlers := carts.NewHandlers(cartsServices, log)
	usersHandlers := users.NewHandlers(usersServices, log)
	authHandlers := auth.NewHandlers(redis, config, authServices, log)

	rg.Post("/stores", storesHandlers.CreateStore)
	rg.Delete("/stores", storesHandlers.DeleteStore)
	rg.Patch("/stores", storesHandlers.UpdateStore)

	rg.Get("/products", productsHandlers.GetProductBySlug)
	rg.Post("/products", productsHandlers.CreateProduct)
	rg.Delete("/products", productsHandlers.DeleteProduct)
	rg.Patch("/products", productsHandlers.UpdateProduct)
	rg.Get("/search-products", productsHandlers.SearchProduct)

	rg.Post("/carts", cartsHandlers.AddToCart)
	rg.Delete("/carts", cartsHandlers.DeleteCartItem)
	rg.Patch("/carts", cartsHandlers.UpdateCartItem)

	rg.Post("/login", authHandlers.Login)
	rg.Get("/oauth-login", authHandlers.OAuthLogin)
	rg.Get("/oauth-callback", authHandlers.OAuthCallback)
	rg.Post("/register", authHandlers.Register)

	rg.Use(middlewares.NewVerifyTokenMiddleware(config))
	rg.Get("/users", usersHandlers.GetUser)
	rg.Patch("/users", usersHandlers.UpdateUser)

	return app.Listen(":8080", fiber.ListenConfig{
		GracefulContext: ctx,
		OnShutdownSuccess: func() {
			slog.Info("http server stopped")
		},
	})
}
