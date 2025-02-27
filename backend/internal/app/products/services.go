package products

import (
	"context"
	"database/sql"
	"errors"
	"log/slog"
	"strings"

	"github.com/hendrywilliam/commerce/internal/queries"
	"github.com/hendrywilliam/commerce/internal/utils"
)

type ProductServices interface {
	CreateProduct(ctx context.Context, cpr CreateProductRequest) (queries.Product, error)
	DeleteProduct(ctx context.Context, dpr DeleteProductRequest) (string, error)
	UpdateProduct(ctx context.Context, upr UpdateProductRequest) (queries.Product, error)
	SearchProducts(ctx context.Context, searchTerm string) ([]queries.Product, error)
	GetProductBySlug(ctx context.Context, slug string) (queries.Product, error)
}

type ProductServicesImpl struct {
	Q   *queries.Queries
	Log *slog.Logger
}

func NewServices(q *queries.Queries, log *slog.Logger) ProductServices {
	return &ProductServicesImpl{
		Q:   q,
		Log: log,
	}
}

func (ps *ProductServicesImpl) GetProductBySlug(ctx context.Context, slug string) (queries.Product, error) {
	product, err := ps.Q.ProductQueries.GetProductBySlug(ctx, slug)
	if err != nil {
		slog.Error(err.Error())
		if errors.Is(err, sql.ErrNoRows) {
			return queries.Product{}, queries.ErrNoProduct
		}
		return queries.Product{}, utils.ErrInternalError
	}
	return product, nil
}

func (ps *ProductServicesImpl) SearchProducts(ctx context.Context, searchTerm string) ([]queries.Product, error) {
	normalized := strings.ReplaceAll(searchTerm, " ", " | ")
	products, err := ps.Q.ProductQueries.SearchProducts(ctx, normalized)
	if err != nil {
		return []queries.Product{}, utils.ErrInternalError
	}
	return products, nil
}

func (ps *ProductServicesImpl) CreateProduct(ctx context.Context, args CreateProductRequest) (queries.Product, error) {
	product, err := ps.Q.ProductQueries.CreateProduct(ctx, queries.CreateProductArgs{
		StoreID:          args.StoreID,
		Name:             args.Name,
		Slug:             utils.Slugify(args.Name),
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
		slog.Error(err.Error())
		if errors.Is(err, sql.ErrNoRows) {
			return queries.Product{}, queries.ErrDuplicateProduct
		}
		return queries.Product{}, utils.ErrInternalError
	}
	return product, nil
}

func (ps *ProductServicesImpl) DeleteProduct(ctx context.Context, args DeleteProductRequest) (string, error) {
	pname, err := ps.Q.ProductQueries.DeleteProduct(ctx, args.ID)
	if err != nil {
		slog.Error(err.Error())
		if errors.Is(err, sql.ErrNoRows) {
			return "", queries.ErrNoProduct
		}
		return "", utils.ErrInternalError
	}
	return pname, nil
}

func (ps *ProductServicesImpl) UpdateProduct(ctx context.Context, args UpdateProductRequest) (queries.Product, error) {
	productData := queries.UpdateProductArgs{
		ID:               args.ID,
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
	}
	if args.Name != nil {
		productData.Name = args.Name
		productSlug := utils.Slugify(*args.Name)
		productData.Slug = &productSlug
	}
	product, err := ps.Q.ProductQueries.UpdateProduct(ctx, productData)
	if err != nil {
		slog.Error(err.Error())
		if errors.Is(err, sql.ErrNoRows) {
			return queries.Product{}, queries.ErrNoProduct
		}
		return queries.Product{}, utils.ErrInternalError
	}
	return product, nil
}
