package stores

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
)

type StoreServices interface {
	CreateStore(ctx context.Context, args CreateStoreRequest) (Store, error)
	DeleteStore(ctx context.Context, args DeleteStoreRequest) (string, error)
	UpdateStore(ctx context.Context, args UpdateStoreRequest) (string, error)
}

type StoreServicesImpl struct {
	Q StoreQueries
}

func NewServices(q StoreQueries) StoreServices {
	return &StoreServicesImpl{
		Q: q,
	}
}

func (ss *StoreServicesImpl) CreateStore(ctx context.Context, args CreateStoreRequest) (Store, error) {
	store, err := ss.Q.CreateStore(ctx, CreateStoreArgs{
		Name:        args.Name,
		Slug:        args.Slug,
		Description: args.Description,
		Active:      args.Active,
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return Store{}, errors.New("store with the same name is exist")
		}
		return Store{}, errors.New("internal server error")
	}
	return store, err
}

func (ss *StoreServicesImpl) DeleteStore(ctx context.Context, args DeleteStoreRequest) (string, error) {
	storeName, err := ss.Q.DeleteStore(ctx, DeleteStoreArgs{
		ID: args.ID,
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return "", errors.New("no such store exist")
		}
		return "", errors.New("internal server error")
	}
	return storeName, err
}

func (ss *StoreServicesImpl) UpdateStore(ctx context.Context, args UpdateStoreRequest) (string, error) {
	storeName, err := ss.Q.UpdateStore(ctx, UpdateStoreArgs{
		ID:          args.ID,
		Name:        args.Name,
		Slug:        args.Slug,
		Description: args.Description,
		Active:      args.Active,
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return "", errors.New("no such store exist")
		}
		return "", errors.New("internal server error")
	}
	return storeName, err
}
