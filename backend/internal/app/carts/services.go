package carts

import (
	"context"
	"errors"
	"slices"

	"github.com/hendrywilliam/commerce/internal/queries"
	"github.com/jackc/pgx/v5"
)

var (
	ErrNoProduct       = errors.New("no such product exist")
	ErrStockExceeds    = errors.New("stock limit exceeds")
	ErrNoProductInCart = errors.New("no product in cart")
	ErrInternalError   = errors.New("internal server error")
)

type CartServices interface {
	AddItemToCart(ctx context.Context, arg AddItemToCartRequest) (string, error)
}

type CartServicesImpl struct {
	Q *queries.Queries
}

func NewServices(q *queries.Queries) CartServices {
	return &CartServicesImpl{
		Q: q,
	}
}

func (cs *CartServicesImpl) AddItemToCart(ctx context.Context, args AddItemToCartRequest) (string, error) {
	var productName string
	err := queries.ExecTx(cs.Q.DB, ctx, func(q queries.Queries) error {
		cart, err := q.CartQueries.GetCart(ctx, args.CartID)
		if err != nil {
			// there is no cart exist.
			if errors.Is(err, pgx.ErrNoRows) {
				product, err := q.ProductQueries.GetProduct(ctx, args.CartItem.ID)
				if err != nil {
					if errors.Is(err, pgx.ErrNoRows) {
						return ErrNoProduct
					}
					return ErrInternalError
				}
				if args.CartItem.Qty > product.Stock {
					return ErrStockExceeds
				}
				_, err = q.CartQueries.CreateCart(ctx, queries.CreateCartArgs{
					IsClosed: false,
					Items:    []queries.CartItem{args.CartItem},
				})
				if err != nil {
					return ErrInternalError
				}
				productName = product.Name
				return nil
			}
			return ErrInternalError
		}
		product, err := q.ProductQueries.GetProduct(ctx, args.CartItem.ID)
		if err != nil {
			// no product exist
			if errors.Is(err, pgx.ErrNoRows) {
				return ErrNoProduct
			}
			return ErrInternalError
		}
		productName = product.Name
		if args.CartItem.Qty > product.Stock {
			return ErrStockExceeds
		}
		productIndex := slices.IndexFunc(cart.Items, func(i queries.CartItem) bool {
			return i.ID == args.CartItem.ID
		})
		productInCart := cart.Items[productIndex]
		if productIndex == -1 {
			return ErrNoProductInCart
		}
		if productInCart.Qty+args.CartItem.Qty > product.Stock {
			return ErrStockExceeds
		}
		cart.Items[productIndex].Qty = productInCart.Qty + args.CartItem.Qty
		err = cs.Q.CartQueries.UpdateCart(ctx, queries.UpdateCartArgs{
			ID:    cart.ID,
			Items: cart.Items,
		})
		if err != nil {
			return ErrInternalError
		}
		return nil
	})
	return productName, err
}
