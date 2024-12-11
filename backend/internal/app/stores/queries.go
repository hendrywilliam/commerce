package stores

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

type StoreQueries interface {
	CreateStore(ctx context.Context, args CreateStoreArgs) (Store, error)
	DeleteStore(ctx context.Context, args DeleteStoreArgs) (string, error)
	UpdateStore(ctx context.Context, args UpdateStoreArgs) (string, error)
}

type StoreQueriesImpl struct {
	DB *pgxpool.Pool
}

func NewQueries(db *pgxpool.Pool) StoreQueries {
	return &StoreQueriesImpl{
		DB: db,
	}
}

func (sq *StoreQueriesImpl) CreateStore(ctx context.Context, args CreateStoreArgs) (Store, error) {
	row := sq.DB.QueryRow(ctx, `
		INSERT INTO stores (
			name,
			slug,
			description,
			active
		) VALUES (
			$1, $2, $3, $4
		) ON CONFLICT (name) DO NOTHING
		RETURNING id, name;
	`, args.Name, args.Slug, args.Description, args.Active)
	var s Store
	err := row.Scan(
		&s.ID,
		&s.Name,
	)
	return s, err
}

func (sq *StoreQueriesImpl) DeleteStore(ctx context.Context, args DeleteStoreArgs) (string, error) {
	row := sq.DB.QueryRow(ctx, `
		DELETE FROM stores
		WHERE id = $1
		RETURNING name;
	`, args.ID)
	var n string
	err := row.Scan(&n)
	return n, err
}

func (sq *StoreQueriesImpl) UpdateStore(ctx context.Context, args UpdateStoreArgs) (string, error) {
	row := sq.DB.QueryRow(ctx, `
		UPDATE stores
			SET
				name = $2,
				slug = $3,
				description = $4,
				active = $5
			WHERE id = $1
			RETURNING name;
	`, args.ID, args.Name, args.Slug, args.Description, args.Active)
	var n string
	err := row.Scan(&n)
	return n, err
}
