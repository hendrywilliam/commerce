package stores

import (
	"context"
	"errors"

	"github.com/hendrywilliam/commerce/internal/queries"
	"github.com/jackc/pgx/v5"
)

var (
	ErrNoStore        = errors.New("no such store exist")
	ErrDuplicateStore = errors.New("duplicate store detected")
	ErrInternalError  = errors.New("internal server errors")
)

type StoreServices interface {
	CreateStore(ctx context.Context, args CreateStoreRequest) (queries.Store, error)
	DeleteStore(ctx context.Context, args DeleteStoreRequest) (string, error)
	UpdateStore(ctx context.Context, args UpdateStoreRequest) (string, error)
}

type StoreServicesImpl struct {
	S *queries.Queries
}

func NewServices(s *queries.Queries) StoreServices {
	return &StoreServicesImpl{
		S: s,
	}
}

func (ss *StoreServicesImpl) CreateStore(ctx context.Context, args CreateStoreRequest) (queries.Store, error) {
	store, err := ss.S.StoreQueries.CreateStore(ctx, queries.CreateStoreArgs{
		Name:        args.Name,
		Slug:        args.Slug,
		Description: args.Description,
		Active:      args.Active,
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return queries.Store{}, ErrDuplicateStore
		}
		return queries.Store{}, ErrInternalError
	}
	return store, err
}

func (ss *StoreServicesImpl) DeleteStore(ctx context.Context, args DeleteStoreRequest) (string, error) {
	storeName, err := ss.S.StoreQueries.DeleteStore(ctx, args.ID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return "", ErrNoStore
		}
		return "", ErrInternalError
	}
	return storeName, err
}

func (ss *StoreServicesImpl) UpdateStore(ctx context.Context, args UpdateStoreRequest) (string, error) {
	storeName, err := ss.S.StoreQueries.UpdateStore(ctx, queries.UpdateStoreArgs{
		ID:          args.ID,
		Name:        args.Name,
		Slug:        args.Slug,
		Description: args.Description,
		Active:      args.Active,
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return "", ErrNoStore
		}
		return "", ErrInternalError
	}
	return storeName, err
}
