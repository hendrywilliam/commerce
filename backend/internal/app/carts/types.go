package carts

import "github.com/hendrywilliam/commerce/internal/queries"

type CartRequest struct {
	CartID   uint64           `json:"cart_id" validate:"required"`
	CartItem queries.CartItem `json:"cart_items" validate:"required"`
}

type DeleteCartRequest struct {
	CartID uint64 `json:"cart_id" validate:"required"`
	ItemID uint64 `json:"item_id" validate:"required"`
}
