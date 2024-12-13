package carts

import "github.com/hendrywilliam/commerce/internal/queries"

type AddItemToCartRequest struct {
	CartID   uint64           `json:"cart_id" validate:"required"`
	CartItem queries.CartItem `json:"cart_items" validate:"required"`
}
