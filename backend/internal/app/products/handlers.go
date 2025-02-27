package products

import (
	"fmt"
	"log/slog"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v3"
	"github.com/hendrywilliam/commerce/internal/utils"
)

type ProductHandlers interface {
	SearchProduct(c fiber.Ctx) error
	CreateProduct(c fiber.Ctx) error
	DeleteProduct(c fiber.Ctx) error
	UpdateProduct(c fiber.Ctx) error
	GetProductBySlug(c fiber.Ctx) error
}

type ProductHandlersImpl struct {
	Services ProductServices
	Log      *slog.Logger
}

func NewHandlers(services ProductServices, log *slog.Logger) ProductHandlers {
	return &ProductHandlersImpl{
		Services: services,
		Log:      log,
	}
}

func (ph *ProductHandlersImpl) GetProductBySlug(c fiber.Ctx) error {
	var req GetProductRequest
	if err := c.Bind().Body(&req); err != nil {
		slog.Error(err.Error())
		if e, ok := err.(validator.ValidationErrors); ok {
			err := utils.DigestValErrors(e)
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"message": "failed to validate",
				"errors":  err,
			})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": utils.ErrInternalError.Error(),
		})
	}
	product, err := ph.Services.GetProductBySlug(c.Context(), req.Slug)
	if err != nil {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{
			"message": utils.ErrInternalError.Error(),
		})
	}
	return c.Status(http.StatusOK).JSON(fiber.Map{
		"message": "product found",
		"data":    product,
	})
}

func (ph *ProductHandlersImpl) SearchProduct(c fiber.Ctx) error {
	var req SearchProductsRequest
	if err := c.Bind().Body(&req); err != nil {
		slog.Error(err.Error())
		if e, ok := err.(validator.ValidationErrors); ok {
			err := utils.DigestValErrors(e)
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"message": "failed to validate",
				"errors":  err,
			})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": utils.ErrInternalError.Error(),
		})
	}
	products, err := ph.Services.SearchProducts(c.Context(), req.SearchTerm)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "failed to get product(s)",
		})
	}
	if len(products) == 0 {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{
			"message": "no product found",
		})
	}
	return c.Status(http.StatusOK).JSON(fiber.Map{
		"message": "product found",
		"data":    products,
	})
}

func (ph *ProductHandlersImpl) CreateProduct(c fiber.Ctx) error {
	var req CreateProductRequest
	if err := c.Bind().Body(&req); err != nil {
		slog.Error(err.Error())
		if e, ok := err.(validator.ValidationErrors); ok {
			err := utils.DigestValErrors(e)
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"message": "failed to validate",
				"errors":  err,
			})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": utils.ErrInternalError.Error(),
		})
	}
	product, err := ph.Services.CreateProduct(c.Context(), req)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": utils.ErrInternalError.Error(),
		})
	}
	return c.Status(http.StatusCreated).JSON(fiber.Map{
		"message": "product created",
		"data":    product,
	})
}

func (ph *ProductHandlersImpl) DeleteProduct(c fiber.Ctx) error {
	var req DeleteProductRequest
	if err := c.Bind().Query(&req); err != nil {
		slog.Error(err.Error())
		if e, ok := err.(validator.ValidationErrors); ok {
			err := utils.DigestValErrors(e)
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"message": "failed to validate",
				"errors":  err,
			})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": utils.ErrInternalError.Error(),
		})
	}
	productName, err := ph.Services.DeleteProduct(c.Context(), req)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": utils.ErrInternalError.Error(),
		})
	}
	return c.Status(http.StatusOK).JSON(fiber.Map{
		"message": fmt.Sprintf("product %v has been deleted", productName),
	})
}

func (ph *ProductHandlersImpl) UpdateProduct(c fiber.Ctx) error {
	var req UpdateProductRequest
	if err := c.Bind().Body(&req); err != nil {
		slog.Error(err.Error())
		if e, ok := err.(validator.ValidationErrors); ok {
			err := utils.DigestValErrors(e)
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"message": "failed to validate",
				"errors":  err,
			})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": utils.ErrInternalError.Error(),
		})
	}
	product, err := ph.Services.UpdateProduct(c.Context(), req)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": utils.ErrInternalError.Error(),
		})
	}
	return c.Status(http.StatusOK).JSON(fiber.Map{
		"message": fmt.Sprintf("product %v has been updated", product.Name),
		"data":    product,
	})
}
