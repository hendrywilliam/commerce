package carts

import (
	"context"
	"errors"
	"slices"

	"github.com/hendrywilliam/commerce/internal/queries"
	"github.com/hendrywilliam/commerce/internal/utils"
	"github.com/jackc/pgx/v5"
)

type CartServices interface {
	AddToCart(ctx context.Context, args CartRequest) (string, error)
	DeleteFromCart(ctx context.Context, args DeleteCartRequest) error
}

type CartServicesImpl struct {
	Q *queries.Queries
}

func NewServices(q *queries.Queries) CartServices {
	return &CartServicesImpl{
		Q: q,
	}
}

func (cs *CartServicesImpl) AddToCart(ctx context.Context, args CartRequest) (string, error) {
	var productName string
	err := queries.ExecTx(ctx, cs.Q.DB, func(q queries.Queries) error {
		cart, err := q.CartQueries.GetCart(ctx, args.CartID)
		if err != nil {
			// there is no cart exist.
			if errors.Is(err, pgx.ErrNoRows) {
				product, err := q.ProductQueries.GetProduct(ctx, args.CartItem.ID)
				if err != nil {
					if errors.Is(err, pgx.ErrNoRows) {
						return queries.ErrNoProduct
					}
					return utils.ErrInternalError
				}
				if args.CartItem.Qty > product.Stock {
					return queries.ErrStockExceeds
				}
				_, err = q.CartQueries.CreateCart(ctx, queries.CreateCartArgs{
					IsClosed: false,
					Items:    []queries.CartItem{args.CartItem},
				})
				if err != nil {
					return utils.ErrInternalError
				}
				productName = product.Name
				return nil
			}
			return utils.ErrInternalError
		}
		product, err := q.ProductQueries.GetProduct(ctx, args.CartItem.ID)
		if err != nil {
			// no product exist
			if errors.Is(err, pgx.ErrNoRows) {
				return queries.ErrNoProduct
			}
			return utils.ErrInternalError
		}
		productName = product.Name
		if args.CartItem.Qty > product.Stock {
			return queries.ErrStockExceeds
		}
		productIndex := slices.IndexFunc(cart.Items, func(i queries.CartItem) bool {
			return i.ID == args.CartItem.ID
		})
		if productIndex == -1 {
			return queries.ErrNoProductInCart
		}
		productInCart := cart.Items[productIndex]
		if productInCart.Qty+args.CartItem.Qty > product.Stock {
			return queries.ErrStockExceeds
		}
		cart.Items[productIndex].Qty = productInCart.Qty + args.CartItem.Qty
		err = cs.Q.CartQueries.UpdateCart(ctx, queries.UpdateCartArgs{
			ID:    cart.ID,
			Items: cart.Items,
		})
		if err != nil {
			return utils.ErrInternalError
		}
		return nil
	})
	return productName, err
}

func (cs *CartServicesImpl) DeleteFromCart(ctx context.Context, args DeleteCartRequest) error {
	return queries.ExecTx(ctx, cs.Q.DB, func(q queries.Queries) error {
		cart, err := q.CartQueries.GetCart(ctx, args.CartID)
		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				return queries.ErrCartNotFound
			}
			return utils.ErrInternalError
		}
		modifiedCartItems := slices.DeleteFunc(cart.Items, func(i queries.CartItem) bool {
			return i.ID == args.ItemID
		})
		err = q.CartQueries.UpdateCart(ctx, queries.UpdateCartArgs{
			ID:    cart.ID,
			Items: modifiedCartItems,
		})
		if err != nil {
			return utils.ErrInternalError
		}
		return nil
	})
}
