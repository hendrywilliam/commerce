package servers

import (
	"context"
	"log/slog"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v3"
	"github.com/hendrywilliam/commerce/internal/app/auth"
	"github.com/hendrywilliam/commerce/internal/app/carts"
	"github.com/hendrywilliam/commerce/internal/app/products"
	"github.com/hendrywilliam/commerce/internal/app/stores"
	"github.com/hendrywilliam/commerce/internal/app/users"
	"github.com/hendrywilliam/commerce/internal/queries"
	"github.com/hendrywilliam/commerce/internal/utils"
	"github.com/redis/go-redis/v9"

	"github.com/jackc/pgx/v5/pgxpool"
)

func ServeHTTP(ctx context.Context, db *pgxpool.Pool, redis *redis.Client, config *utils.AppConfig) error {
	app := fiber.New(fiber.Config{
		StructValidator: &utils.StructValidator{Validator: validator.New(validator.WithRequiredStructEnabled())},
	})
	rg := app.Group("/v1")
	allqs := queries.NewQueries(db)

	productsServices := products.NewServices(&allqs)
	storesServices := stores.NewServices(&allqs)
	cartsServices := carts.NewServices(&allqs)
	usersServices := users.NewServices(&allqs)
	authServices := auth.NewServices(&allqs)

	productsHandlers := products.NewHandlers(productsServices)
	storesHandlers := stores.NewHandlers(storesServices)
	cartsHandlers := carts.NewHandlers(cartsServices)
	usersHandlers := users.NewHandlers(usersServices)
	authHandlers := auth.NewHandlers(redis, config, authServices)

	rg.Post("/stores", storesHandlers.CreateStore)
	rg.Delete("/stores", storesHandlers.DeleteStore)
	rg.Patch("/stores", storesHandlers.UpdateStore)

	rg.Get("/products", productsHandlers.GetProductBySlug)
	rg.Post("/products", productsHandlers.CreateProduct)
	rg.Delete("/products", productsHandlers.DeleteProduct)
	rg.Patch("/products", productsHandlers.UpdateProduct)
	rg.Get("/search_products", productsHandlers.SearchProduct)

	rg.Post("/carts", cartsHandlers.AddToCart)
	rg.Delete("/carts", cartsHandlers.DeleteCartItem)
	rg.Patch("/carts", cartsHandlers.UpdateCartItem)

	rg.Get("/users", usersHandlers.GetUser)
	rg.Patch("/users", usersHandlers.UpdateUser)

	rg.Post("/login", authHandlers.Login)
	rg.Post("/register", authHandlers.Register)

	return app.Listen(":8080", fiber.ListenConfig{
		GracefulContext: ctx,
		OnShutdownSuccess: func() {
			slog.Info("http server stopped")
		},
	})
}
