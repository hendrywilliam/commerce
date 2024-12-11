package products

import (
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v3"
	"github.com/hendrywilliam/commerce/internal/utils"
)

type ProductHandlers interface {
	CreateProduct(c fiber.Ctx) error
	DeleteProduct(c fiber.Ctx) error
	UpdateProduct(c fiber.Ctx) error
}

type ProductHandlersImpl struct {
	Services ProductServices
}

func NewHandlers(services ProductServices) ProductHandlers {
	return &ProductHandlersImpl{
		Services: services,
	}
}

func (ph *ProductHandlersImpl) CreateProduct(c fiber.Ctx) error {
	var req CreateProductRequest
	if err := c.Bind().Body(&req); err != nil {
		if e, ok := err.(validator.ValidationErrors); ok {
			err := utils.DigestErrors(e)
			return c.Status(http.StatusBadRequest).JSON(utils.FailedResponse(utils.ResponseInfo{
				Message: "validation failed",
			}, err))
		}
		return c.Status(http.StatusBadRequest).JSON(utils.FailedResponse(utils.ResponseInfo{
			Message: "internal server error",
		}, nil))
	}
	product, err := ph.Services.CreateProduct(c.Context(), req)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(utils.FailedResponse(utils.ResponseInfo{
			Message: "failed to create a new product",
			Reason:  err.Error(),
		}, nil))
	}
	return c.Status(http.StatusCreated).JSON(utils.SuccessResponse(utils.ResponseInfo{
		Message: "product created",
	}, CreateProductResponse{Name: product.Name}))
}

func (ph *ProductHandlersImpl) DeleteProduct(c fiber.Ctx) error {
	var req DeleteProductRequest
	if err := c.Bind().Query(&req); err != nil {
		if e, ok := err.(validator.ValidationErrors); ok {
			err := utils.DigestErrors(e)
			return c.Status(http.StatusBadRequest).JSON(utils.FailedResponse(utils.ResponseInfo{
				Message: "validation failed",
			}, err))
		}
		return c.Status(http.StatusBadRequest).JSON(utils.FailedResponse(utils.ResponseInfo{
			Message: "internal server error",
		}, nil))
	}
	productName, err := ph.Services.DeleteProduct(c.Context(), req)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(utils.FailedResponse(utils.ResponseInfo{
			Message: "failed to delete a product",
			Reason:  err.Error(),
		}, nil))
	}
	return c.Status(http.StatusCreated).JSON(utils.SuccessResponse(utils.ResponseInfo{
		Message: "product deleted",
	}, CreateProductResponse{Name: productName}))
}

func (ph *ProductHandlersImpl) UpdateProduct(c fiber.Ctx) error {
	var req UpdateProductRequest
	if err := c.Bind().Body(&req); err != nil {
		if e, ok := err.(validator.ValidationErrors); ok {
			err := utils.DigestErrors(e)
			return c.Status(http.StatusBadRequest).JSON(utils.FailedResponse(utils.ResponseInfo{
				Message: "validation failed",
			}, err))
		}
		return c.Status(http.StatusBadRequest).JSON(utils.FailedResponse(utils.ResponseInfo{
			Message: "internal server error",
		}, nil))
	}
	product, err := ph.Services.UpdateProduct(c.Context(), req)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(utils.FailedResponse(utils.ResponseInfo{
			Message: "failed to delete a product",
			Reason:  err.Error(),
		}, nil))
	}
	return c.Status(http.StatusOK).JSON(utils.SuccessResponse(utils.ResponseInfo{
		Message: "product updated",
	}, UpdateProductResponse{
		Name:     product.Name,
		Slug:     product.Slug,
		UpdateAt: product.UpdatedAt,
	}))
}
