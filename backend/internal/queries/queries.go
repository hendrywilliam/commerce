package queries

import (
	"context"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
)

type DbTx interface {
	Query(ctx context.Context, sql string, args ...any) (pgx.Rows, error)
	QueryRow(ctx context.Context, sql string, args ...any) pgx.Row
	Begin(ctx context.Context) (pgx.Tx, error)
	Exec(ctx context.Context, sql string, arguments ...any) (commandTag pgconn.CommandTag, err error)
}

// centralized queries
type Queries struct {
	DB          DbTx
	CartQueries interface {
		GetCart(ctx context.Context, ID uint64) (Cart, error)
		CreateCart(ctx context.Context, args CreateCartArgs) (Cart, error)
		UpdateCart(ctx context.Context, args UpdateCartArgs) error
	}
	ProductQueries interface {
		CreateProduct(ctx context.Context, args CreateProductArgs) (Product, error)
		DeleteProduct(ctx context.Context, ID uint64) (string, error)
		UpdateProduct(ctx context.Context, args UpdateProductArgs) (Product, error)
		GetProduct(ctx context.Context, ID uint64) (Product, error)
	}
	StoreQueries interface {
		CreateStore(ctx context.Context, args CreateStoreArgs) (Store, error)
		DeleteStore(ctx context.Context, ID uint64) (string, error)
		UpdateStore(ctx context.Context, args UpdateStoreArgs) (string, error)
	}
}

func NewQueries(db DbTx) Queries {
	return Queries{
		DB:             db,
		CartQueries:    &CartQueriesImpl{db},
		ProductQueries: &ProductQueriesImpl{db},
		StoreQueries:   &StoreQueriesImpl{db},
	}
}

func ExecTx(ctx context.Context, db DbTx, fn func(Queries) error) error {
	tx, err := db.Begin(ctx)
	if err != nil {
		return err
	}
	n := NewQueries(tx)
	if err = fn(n); err != nil {
		tx.Rollback(ctx)
		return err
	}
	return tx.Commit(ctx)
}
