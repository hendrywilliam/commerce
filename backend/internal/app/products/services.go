package products

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
)

type ProductServices interface {
	CreateProduct(ctx context.Context, cpr CreateProductRequest) (Product, error)
	DeleteProduct(ctx context.Context, dpr DeleteProductRequest) (string, error)
	UpdateProduct(ctx context.Context, upr UpdateProductRequest) (Product, error)
}

type ProductServicesImpl struct {
	Q ProductQueries
}

func NewServices(q ProductQueries) ProductServices {
	return &ProductServicesImpl{
		Q: q,
	}
}

func (ps *ProductServicesImpl) CreateProduct(ctx context.Context, cpr CreateProductRequest) (Product, error) {
	product, err := ps.Q.CreateProduct(ctx, CreateProductArgs{
		StoreID:          cpr.StoreID,
		Name:             cpr.Name,
		Slug:             cpr.Slug,
		Description:      cpr.Description,
		ShortDescription: cpr.ShortDescription,
		Sku:              cpr.Sku,
		Weight:           cpr.Weight,
		Price:            cpr.Price,
		Stock:            cpr.Stock,
		CategoryID:       cpr.CategoryID,
		Images:           cpr.Images,
		AttributeGroupID: cpr.AttributeGroupID,
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return Product{}, errors.New("product with the same 'sku' is exist")
		}
		return Product{}, err
	}
	return product, err
}

func (ps *ProductServicesImpl) DeleteProduct(ctx context.Context, dpr DeleteProductRequest) (string, error) {
	pname, err := ps.Q.DeleteProduct(ctx, DeleteProductArgs{
		ID: dpr.ID,
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return "", errors.New("no such product exist")
		}
		return "", errors.New("internal server error")
	}
	return pname, err
}

func (ps *ProductServicesImpl) UpdateProduct(ctx context.Context, upr UpdateProductRequest) (Product, error) {
	product, err := ps.Q.UpdateProduct(ctx, UpdateProductArgs{
		ID:               upr.ID,
		Name:             upr.Name,
		Slug:             upr.Slug,
		Description:      upr.Description,
		ShortDescription: upr.ShortDescription,
		Sku:              upr.Sku,
		Weight:           upr.Weight,
		Price:            upr.Price,
		Stock:            upr.Stock,
		CategoryID:       upr.CategoryID,
		Images:           upr.Images,
		IsVisible:        upr.IsVisible,
		AttributeGroupID: upr.AttributeGroupID,
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return Product{}, errors.New("no such product exist")
		}
		return Product{}, errors.New("internal server error")
	}
	return product, err
}
