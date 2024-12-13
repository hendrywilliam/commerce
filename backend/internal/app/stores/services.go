package stores

import (
	"context"
	"errors"

	"github.com/hendrywilliam/commerce/internal/queries"
	"github.com/hendrywilliam/commerce/internal/utils"
	"github.com/jackc/pgx/v5"
)

type StoreServices interface {
	CreateStore(ctx context.Context, args CreateStoreRequest) (queries.Store, error)
	DeleteStore(ctx context.Context, args DeleteStoreRequest) (string, error)
	UpdateStore(ctx context.Context, args UpdateStoreRequest) (string, error)
}

type StoreServicesImpl struct {
	Q *queries.Queries
}

func NewServices(s *queries.Queries) StoreServices {
	return &StoreServicesImpl{
		Q: s,
	}
}

func (ss *StoreServicesImpl) CreateStore(ctx context.Context, args CreateStoreRequest) (queries.Store, error) {
	store, err := ss.Q.StoreQueries.CreateStore(ctx, queries.CreateStoreArgs{
		Name:        args.Name,
		Slug:        args.Slug,
		Description: args.Description,
		Active:      args.Active,
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return queries.Store{}, queries.ErrDuplicateStore
		}
		return queries.Store{}, utils.ErrInternalError
	}
	return store, err
}

func (ss *StoreServicesImpl) DeleteStore(ctx context.Context, args DeleteStoreRequest) (string, error) {
	storeName, err := ss.Q.StoreQueries.DeleteStore(ctx, args.ID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return "", queries.ErrNoStore
		}
		return "", utils.ErrInternalError
	}
	return storeName, err
}

func (ss *StoreServicesImpl) UpdateStore(ctx context.Context, args UpdateStoreRequest) (string, error) {
	storeName, err := ss.Q.StoreQueries.UpdateStore(ctx, queries.UpdateStoreArgs{
		ID:          args.ID,
		Name:        args.Name,
		Slug:        args.Slug,
		Description: args.Description,
		Active:      args.Active,
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return "", queries.ErrNoStore
		}
		return "", utils.ErrInternalError
	}
	return storeName, err
}
