package carts

import (
	"fmt"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v3"
	"github.com/hendrywilliam/commerce/internal/utils"
)

type CartHandlers interface {
	AddItemToCart(c fiber.Ctx) error
	// UpdateCartItems(c fiber.Ctx) error
	// DeleteCartItems(c fiber.Ctx) error
}

type CartHandlersImpl struct {
	Services CartServices
}

func NewHandlers(services CartServices) CartHandlers {
	return &CartHandlersImpl{
		Services: services,
	}
}

func (ch *CartHandlersImpl) AddItemToCart(c fiber.Ctx) error {
	var req AddItemToCartRequest
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
	productName, err := ch.Services.AddItemToCart(c.Context(), AddItemToCartRequest{
		CartID:   req.CartID,
		CartItem: req.CartItem,
	})
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(utils.FailedResponse(utils.ResponseInfo{
			Message: "failed to add item to cart",
			Reason:  err.Error(),
		}, nil))
	}
	return c.Status(http.StatusOK).JSON(utils.SuccessResponse(utils.ResponseInfo{
		Message: fmt.Sprintf("%v has been added to cart", productName),
	}, nil))
}

// func (ch *CartHandlersImpl) UpdateCartItems(c fiber.Ctx) error {

// }

// func (ch *CartHandlersImpl) DeleteCartItems(c fiber.Ctx) error {

// }
