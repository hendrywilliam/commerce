package carts

import (
	"context"
	"errors"
	"slices"

	"github.com/hendrywilliam/commerce/internal/queries"
	"github.com/hendrywilliam/commerce/internal/utils"
	"github.com/jackc/pgx/v5"
)

type ProductName = string

type CartServices interface {
	AddToCart(ctx context.Context, args CartRequest) (ProductName, error)
	DeleteFromCart(ctx context.Context, args DeleteCartRequest) error
	UpdateCartItem(ctx context.Context, args CartRequest) error
}

type CartServicesImpl struct {
	Q *queries.Queries
}

func NewServices(q *queries.Queries) CartServices {
	return &CartServicesImpl{
		Q: q,
	}
}

func (cs *CartServicesImpl) AddToCart(ctx context.Context, args CartRequest) (ProductName, error) {
	var productName ProductName
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
			if errors.Is(err, pgx.ErrNoRows) {
				return queries.ErrNoProduct
			}
			return utils.ErrInternalError
		}
		productIndex := slices.IndexFunc(cart.Items, func(i queries.CartItem) bool {
			return i.ID == args.CartItem.ID
		})
		if productIndex == -1 {
			if args.CartItem.Qty > product.Stock {
				return queries.ErrStockExceeds
			}
			cart.Items = append(cart.Items, queries.CartItem{
				ID:  args.CartItem.ID,
				Qty: args.CartItem.Qty,
			})
			err = q.CartQueries.UpdateCart(ctx, queries.UpdateCartArgs{
				ID:    args.CartID,
				Items: cart.Items,
			})
			if err != nil {
				return utils.ErrInternalError
			}
		} else {
			newQty := cart.Items[productIndex].Qty + args.CartItem.Qty
			if newQty > product.Stock {
				return queries.ErrStockExceeds
			}
			cart.Items[productIndex].Qty = newQty
			err = q.CartQueries.UpdateCart(ctx, queries.UpdateCartArgs{
				ID:    args.CartID,
				Items: cart.Items,
			})
			if err != nil {
				return utils.ErrInternalError
			}
		}
		productName = product.Name
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

func (cs *CartServicesImpl) UpdateCartItem(ctx context.Context, args CartRequest) error {
	return queries.ExecTx(ctx, cs.Q.DB, func(q queries.Queries) error {
		cart, err := q.CartQueries.GetCart(ctx, args.CartID)
		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				return queries.ErrCartNotFound
			}
			return utils.ErrInternalError
		}
		product, err := q.ProductQueries.GetProduct(ctx, args.CartItem.ID)
		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				return queries.ErrNoProduct
			}
			return utils.ErrInternalError
		}
		idx := slices.IndexFunc(cart.Items, func(i queries.CartItem) bool {
			return i.ID == args.CartItem.ID
		})
		if idx == -1 {
			return queries.ErrNoProductInCart
		}
		if args.CartItem.Qty > product.Stock {
			return queries.ErrStockExceeds
		}
		if args.CartItem.Qty == 0 {
			modifiedCartItems := slices.DeleteFunc(cart.Items, func(q queries.CartItem) bool {
				return q.ID == args.CartItem.ID
			})
			err = q.CartQueries.UpdateCart(ctx, queries.UpdateCartArgs{
				ID:    args.CartID,
				Items: modifiedCartItems,
			})
			if err != nil {
				return utils.ErrInternalError
			}
		} else {
			cart.Items[idx].Qty = args.CartItem.Qty
			err = q.CartQueries.UpdateCart(ctx, queries.UpdateCartArgs{
				ID:    args.CartID,
				Items: cart.Items,
			})
			if err != nil {
				return utils.ErrInternalError
			}
		}
		return nil
	})
}
