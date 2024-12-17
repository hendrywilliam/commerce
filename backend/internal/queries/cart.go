package queries

import (
	"context"
	"errors"
	"time"
)

var (
	ErrNoProductInCart = errors.New("No such product exist in cart.")
	ErrCartNotFound    = errors.New("Cart is not exist.")
)

type CartItem struct {
	ID  uint64 `json:"id"`
	Qty uint64 `json:"qty"`
}

type Cart struct {
	ID        uint64     `json:"id,omitempty"`
	Items     []CartItem `json:"items,omitempty"`
	IsClosed  bool       `json:"is_closed,omitempty"`
	CreatedAt *time.Time `json:"created_at,omitempty"`
	UpdatedAt *time.Time `json:"updated_at,omitempty"`
}

type CartQueriesImpl struct {
	DB DbTx
}

func (ch *CartQueriesImpl) GetCart(ctx context.Context, ID uint64) (Cart, error) {
	row := ch.DB.QueryRow(ctx, `
		SELECT 
			id,
			items,
			is_closed
		FROM carts
		WHERE id = $1
	`, ID)
	var c Cart
	err := row.Scan(
		&c.ID,
		&c.Items,
		&c.IsClosed,
	)
	return c, err
}

type CreateCartArgs struct {
	Items    []CartItem
	IsClosed bool
}

func (ch *CartQueriesImpl) CreateCart(ctx context.Context, args CreateCartArgs) (Cart, error) {
	row := ch.DB.QueryRow(ctx, `
		INSERT INTO carts (
			items,
			is_closed
		) VALUES (
			$1, $2
		) RETURNING id, items, is_closed;
	`, args.Items, args.IsClosed)
	var c Cart
	err := row.Scan(
		&c.ID,
		&c.Items,
		&c.IsClosed,
	)
	return c, err
}

type UpdateCartArgs struct {
	ID    uint64
	Items []CartItem
}

func (ch *CartQueriesImpl) UpdateCart(ctx context.Context, args UpdateCartArgs) error {
	ctg, err := ch.DB.Exec(ctx, `
		UPDATE carts
		SET 
			items = $2
		WHERE id = $1;
	`,
		args.ID,
		args.Items,
	)
	if ctg.RowsAffected() != 1 {
		return errors.New("no row found to delete")
	}
	return err
}
