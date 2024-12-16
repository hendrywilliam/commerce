package server

import (
	"context"
	"log/slog"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v3"
	"github.com/hendrywilliam/commerce/internal/app/carts"
	"github.com/hendrywilliam/commerce/internal/app/products"
	"github.com/hendrywilliam/commerce/internal/app/stores"
	"github.com/hendrywilliam/commerce/internal/queries"
	"github.com/hendrywilliam/commerce/internal/utils"

	"github.com/jackc/pgx/v5/pgxpool"
)

func ServeHTTP(ctx context.Context, db *pgxpool.Pool) error {
	app := fiber.New(fiber.Config{
		StructValidator: &utils.StructValidator{Validator: validator.New()},
	})
	rg := app.Group("/v1")

	// thou shall remain modular
	allqs := queries.NewQueries(db)

	productsServices := products.NewServices(&allqs)
	storesServices := stores.NewServices(&allqs)
	cartsServices := carts.NewServices(&allqs)

	productsHandlers := products.NewHandlers(productsServices)
	storesHandlers := stores.NewHandlers(storesServices)
	cartsHandlers := carts.NewHandlers(cartsServices)

	rg.Post("/stores", storesHandlers.CreateStore)
	rg.Delete("/stores", storesHandlers.DeleteStore)
	rg.Patch("/stores", storesHandlers.UpdateStore)

	rg.Post("/products", productsHandlers.CreateProduct)
	rg.Delete("/products", productsHandlers.DeleteProduct)
	rg.Patch("/products", productsHandlers.UpdateProduct)

	rg.Post("/carts", cartsHandlers.AddToCart)
	rg.Delete("/carts", cartsHandlers.DeleteCartItem)
	rg.Patch("/carts", cartsHandlers.UpdateCartItem)

	return app.Listen(":8080", fiber.ListenConfig{
		GracefulContext: ctx,
		OnShutdownSuccess: func() {
			slog.Info("http server stopped")
		},
	})
}
