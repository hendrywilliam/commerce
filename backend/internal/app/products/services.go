package products

import (
	"context"
	"errors"

	"github.com/hendrywilliam/commerce/internal/queries"
	"github.com/hendrywilliam/commerce/internal/utils"

	"github.com/jackc/pgx/v5"
)

type ProductServices interface {
	CreateProduct(ctx context.Context, cpr CreateProductRequest) (queries.Product, error)
	DeleteProduct(ctx context.Context, dpr DeleteProductRequest) (string, error)
	UpdateProduct(ctx context.Context, upr UpdateProductRequest) (queries.Product, error)
}

type ProductServicesImpl struct {
	Q *queries.Queries
}

func NewServices(q *queries.Queries) ProductServices {
	return &ProductServicesImpl{
		Q: q,
	}
}

func (ps *ProductServicesImpl) CreateProduct(ctx context.Context, args CreateProductRequest) (queries.Product, error) {
	product, err := ps.Q.ProductQueries.CreateProduct(ctx, queries.CreateProductArgs{
		StoreID:          args.StoreID,
		Name:             args.Name,
		Slug:             args.Slug,
		Description:      args.Description,
		ShortDescription: args.ShortDescription,
		Sku:              args.Sku,
		Weight:           args.Weight,
		Price:            args.Price,
		Stock:            args.Stock,
		CategoryID:       args.CategoryID,
		Images:           args.Images,
		AttributeGroupID: args.AttributeGroupID,
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return queries.Product{}, queries.ErrDuplicateProduct
		}
		return queries.Product{}, err
	}
	return product, err
}

func (ps *ProductServicesImpl) DeleteProduct(ctx context.Context, args DeleteProductRequest) (string, error) {
	pname, err := ps.Q.ProductQueries.DeleteProduct(ctx, args.ID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return "", queries.ErrNoProduct
		}
		return "", utils.ErrInternalError
	}
	return pname, err
}

func (ps *ProductServicesImpl) UpdateProduct(ctx context.Context, args UpdateProductRequest) (queries.Product, error) {
	product, err := ps.Q.ProductQueries.UpdateProduct(ctx, queries.UpdateProductArgs{
		ID:               args.ID,
		Name:             args.Name,
		Slug:             args.Slug,
		Description:      args.Description,
		ShortDescription: args.ShortDescription,
		Sku:              args.Sku,
		Weight:           args.Weight,
		Price:            args.Price,
		Stock:            args.Stock,
		CategoryID:       args.CategoryID,
		Images:           args.Images,
		IsVisible:        args.IsVisible,
		AttributeGroupID: args.AttributeGroupID,
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return queries.Product{}, queries.ErrNoProduct
		}
		return queries.Product{}, utils.ErrInternalError
	}
	return product, err
}
