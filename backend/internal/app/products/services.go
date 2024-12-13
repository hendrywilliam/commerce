package products

import (
	"context"
	"errors"

	"github.com/hendrywilliam/commerce/internal/queries"

	"github.com/jackc/pgx/v5"
)

var (
	ErrNoProduct        = errors.New("no such product exist")
	ErrInternalError    = errors.New("internal server error")
	ErrDuplicateProduct = errors.New("duplicate product detected")
)

type ProductServices interface {
	CreateProduct(ctx context.Context, cpr CreateProductRequest) (queries.Product, error)
	DeleteProduct(ctx context.Context, dpr DeleteProductRequest) (string, error)
	UpdateProduct(ctx context.Context, upr UpdateProductRequest) (queries.Product, error)
}

type ProductServicesImpl struct {
	S *queries.Queries
}

func NewServices(s *queries.Queries) ProductServices {
	return &ProductServicesImpl{
		S: s,
	}
}

func (ps *ProductServicesImpl) CreateProduct(ctx context.Context, args CreateProductRequest) (queries.Product, error) {
	product, err := ps.S.ProductQueries.CreateProduct(ctx, queries.CreateProductArgs{
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
			return queries.Product{}, ErrDuplicateProduct
		}
		return queries.Product{}, err
	}
	return product, err
}

func (ps *ProductServicesImpl) DeleteProduct(ctx context.Context, args DeleteProductRequest) (string, error) {
	pname, err := ps.S.ProductQueries.DeleteProduct(ctx, args.ID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return "", ErrNoProduct
		}
		return "", ErrInternalError
	}
	return pname, err
}

func (ps *ProductServicesImpl) UpdateProduct(ctx context.Context, args UpdateProductRequest) (queries.Product, error) {
	product, err := ps.S.ProductQueries.UpdateProduct(ctx, queries.UpdateProductArgs{
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
			return queries.Product{}, ErrNoProduct
		}
		return queries.Product{}, ErrInternalError
	}
	return product, err
}
