package products

import (
	"fmt"
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
}

func NewHandlers(services ProductServices) ProductHandlers {
	return &ProductHandlersImpl{
		Services: services,
	}
}

func (ph *ProductHandlersImpl) GetProductBySlug(c fiber.Ctx) error {
	var req GetProductRequest
	if err := c.Bind().Body(&req); err != nil {
		if e, ok := err.(validator.ValidationErrors); ok {
			err := utils.DigestValidationErrors(e)
			return c.Status(http.StatusBadRequest).JSON(utils.ErrorResponse(utils.ResponseDetails{
				Info: utils.InfoDetails{
					Message: "Failed to validate.",
					Reason:  "Please provide slug product",
				},
				Errors: err,
			}))
		}
		return c.Status(http.StatusInternalServerError).JSON(utils.ErrorResponse(utils.ResponseDetails{
			Info: utils.InfoDetails{
				Message: utils.ErrInternalError.Error(),
			},
		}))
	}
	product, err := ph.Services.GetProductBySlug(c.Context(), req.Slug)
	if err != nil {
		return c.Status(http.StatusNotFound).JSON(utils.ErrorResponse(utils.ResponseDetails{
			Info: utils.InfoDetails{
				Message: "No product found.",
				Reason:  err.Error(),
			},
		}))
	}
	return c.Status(http.StatusOK).JSON(utils.SuccessResponse(utils.ResponseDetails{
		Info: utils.InfoDetails{
			Message: "Product found.",
		},
		Data: product,
	}))
}

func (ph *ProductHandlersImpl) SearchProduct(c fiber.Ctx) error {
	var req SearchProductsRequest
	if err := c.Bind().Body(&req); err != nil {
		if e, ok := err.(validator.ValidationErrors); ok {
			err := utils.DigestValidationErrors(e)
			return c.Status(http.StatusBadRequest).JSON(utils.ErrorResponse(utils.ResponseDetails{
				Info: utils.InfoDetails{
					Message: "Failed to validate.",
					Reason:  "Please provide search term.",
				},
				Errors: err,
			}))
		}
		return c.Status(http.StatusInternalServerError).JSON(utils.ErrorResponse(utils.ResponseDetails{
			Info: utils.InfoDetails{
				Message: utils.ErrInternalError.Error(),
			},
		}))
	}
	products, err := ph.Services.SearchProducts(c.Context(), req.SearchTerm)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(utils.ErrorResponse(utils.ResponseDetails{
			Info: utils.InfoDetails{
				Message: "Failed to get products",
				Reason:  err.Error(),
			},
		}))
	}
	if len(products) == 0 {
		return c.Status(http.StatusNotFound).JSON(utils.ErrorResponse(utils.ResponseDetails{
			Info: utils.InfoDetails{
				Message: "No products found.",
				Reason:  "The search returned no results.",
			},
		}))
	}
	return c.Status(http.StatusOK).JSON(utils.SuccessResponse(utils.ResponseDetails{
		Info: utils.InfoDetails{
			Message: "Products found.",
		},
		Data: products,
	}))
}

func (ph *ProductHandlersImpl) CreateProduct(c fiber.Ctx) error {
	var req CreateProductRequest
	if err := c.Bind().Body(&req); err != nil {
		if e, ok := err.(validator.ValidationErrors); ok {
			err := utils.DigestValidationErrors(e)
			return c.Status(http.StatusBadRequest).JSON(utils.ErrorResponse(utils.ResponseDetails{
				Info: utils.InfoDetails{
					Message: "Failed to validate.",
				},
				Errors: err,
			}))
		}
		return c.Status(http.StatusInternalServerError).JSON(utils.ErrorResponse(utils.ResponseDetails{
			Info: utils.InfoDetails{
				Message: utils.ErrInternalError.Error(),
			},
		}))
	}
	product, err := ph.Services.CreateProduct(c.Context(), req)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(utils.ErrorResponse(utils.ResponseDetails{
			Info: utils.InfoDetails{
				Message: "Failed to create a new product.",
				Reason:  err.Error(),
			},
		}))
	}
	return c.Status(http.StatusCreated).JSON(utils.SuccessResponse(utils.ResponseDetails{
		Info: utils.InfoDetails{
			Message: "Product created.",
		},
		Data: CreateProductResponse{
			Name: product.Name,
		},
	}))
}

func (ph *ProductHandlersImpl) DeleteProduct(c fiber.Ctx) error {
	var req DeleteProductRequest
	if err := c.Bind().Query(&req); err != nil {
		if e, ok := err.(validator.ValidationErrors); ok {
			err := utils.DigestValidationErrors(e)
			return c.Status(http.StatusBadRequest).JSON(utils.ErrorResponse(utils.ResponseDetails{
				Info: utils.InfoDetails{
					Message: "Failed to validate.",
				},
				Errors: err,
			}))
		}
		return c.Status(http.StatusInternalServerError).JSON(utils.ErrorResponse(utils.ResponseDetails{
			Info: utils.InfoDetails{
				Message: utils.ErrInternalError.Error(),
			},
		}))
	}
	productName, err := ph.Services.DeleteProduct(c.Context(), req)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(utils.ErrorResponse(utils.ResponseDetails{
			Info: utils.InfoDetails{
				Message: "Failed to delete a product.",
				Reason:  err.Error(),
			},
		}))
	}
	return c.Status(http.StatusOK).JSON(utils.SuccessResponse(utils.ResponseDetails{
		Info: utils.InfoDetails{
			Message: fmt.Sprintf("Product %v has been deleted.", productName),
		},
	}))
}

func (ph *ProductHandlersImpl) UpdateProduct(c fiber.Ctx) error {
	var req UpdateProductRequest
	if err := c.Bind().Body(&req); err != nil {
		if e, ok := err.(validator.ValidationErrors); ok {
			err := utils.DigestValidationErrors(e)
			return c.Status(http.StatusBadRequest).JSON(utils.ErrorResponse(utils.ResponseDetails{
				Info: utils.InfoDetails{
					Message: "Failed to validate.",
				},
				Errors: err,
			}))
		}
		return c.Status(http.StatusInternalServerError).JSON(utils.ErrorResponse(utils.ResponseDetails{
			Info: utils.InfoDetails{
				Message: utils.ErrInternalError.Error(),
			},
		}))
	}
	product, err := ph.Services.UpdateProduct(c.Context(), req)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(utils.ErrorResponse(utils.ResponseDetails{
			Info: utils.InfoDetails{
				Message: "Failed to update product",
				Reason:  err.Error(),
			},
		}))
	}
	return c.Status(http.StatusOK).JSON(utils.SuccessResponse(utils.ResponseDetails{
		Info: utils.InfoDetails{
			Message: fmt.Sprintf("%v has been updated", product.Name),
		},
	}))
}
