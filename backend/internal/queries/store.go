package queries

import (
	"context"
	"errors"
	"time"
)

var (
	ErrNoStore        = errors.New("no such store exist")
	ErrDuplicateStore = errors.New("duplicate store detected")
)

type StoreQueriesImpl struct {
	DB DbTx
}

type StoreID = uint64

type Store struct {
	ID          uint64     `json:"id,omitempty"`
	Name        string     `json:"name,omitempty"`
	Slug        string     `json:"slug,omitempty"`
	Description string     `json:"description,omitempty"`
	Active      bool       `json:"active,omitempty"`
	CreatedAt   *time.Time `json:"created_at,omitempty"`
	UpdatedAt   *time.Time `json:"updated_at,omitempty"`
}

type CreateStoreArgs struct {
	Name        string
	Slug        string
	Description string
	Active      bool
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

func (sq *StoreQueriesImpl) DeleteStore(ctx context.Context, ID StoreID) (string, error) {
	row := sq.DB.QueryRow(ctx, `
		DELETE FROM stores
		WHERE id = $1
		RETURNING name;
	`, ID)
	var n string
	err := row.Scan(&n)
	return n, err
}

type UpdateStoreArgs struct {
	ID          uint64
	Name        string
	Slug        string
	Description string
	Active      bool
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
