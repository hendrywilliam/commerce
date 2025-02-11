package carts

import (
	"fmt"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v3"
	"github.com/hendrywilliam/commerce/internal/utils"
)

type CartHandlers interface {
	AddToCart(c fiber.Ctx) error
	DeleteCartItem(c fiber.Ctx) error
	UpdateCartItem(c fiber.Ctx) error
}

type CartHandlersImpl struct {
	Services CartServices
}

func NewHandlers(services CartServices) CartHandlers {
	return &CartHandlersImpl{
		Services: services,
	}
}

func (ch *CartHandlersImpl) AddToCart(c fiber.Ctx) error {
	var req CartRequest
	if err := c.Bind().Body(&req); err != nil {
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
	productName, err := ch.Services.AddToCart(c.Context(), CartRequest{
		CartID:   req.CartID,
		CartItem: req.CartItem,
	})
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "failed to add product to cart",
		})
	}
	return c.Status(http.StatusOK).JSON(fiber.Map{
		"message": fmt.Sprintf("product %v has been added to cart", productName),
	})
}

func (ch *CartHandlersImpl) DeleteCartItem(c fiber.Ctx) error {
	var req DeleteCartRequest
	if err := c.Bind().Body(&req); err != nil {
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
	err := ch.Services.DeleteFromCart(c.Context(), DeleteCartRequest{
		CartID: req.CartID,
		ItemID: req.ItemID,
	})
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "failed to delete product from cart",
		})
	}
	return c.Status(http.StatusOK).JSON(fiber.Map{
		"message": "product removed from cart",
	})
}

func (ch *CartHandlersImpl) UpdateCartItem(c fiber.Ctx) error {
	var req CartRequest
	if err := c.Bind().Body(&req); err != nil {
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
	err := ch.Services.UpdateCartItem(c.Context(), req)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "failed to update cart",
		})
	}
	return c.Status(http.StatusOK).JSON(fiber.Map{
		"message": "cart has been updated",
	})
}
