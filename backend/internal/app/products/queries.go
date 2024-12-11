package products

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

type ProductQueries interface {
	CreateProduct(ctx context.Context, args CreateProductArgs) (Product, error)
	DeleteProduct(ctx context.Context, args DeleteProductArgs) (string, error)
	UpdateProduct(ctx context.Context, args UpdateProductArgs) (Product, error)
}

type ProductQueriesImpl struct {
	DB *pgxpool.Pool
}

func NewQueries(db *pgxpool.Pool) ProductQueries {
	return &ProductQueriesImpl{
		DB: db,
	}
}

func (pq *ProductQueriesImpl) CreateProduct(ctx context.Context, args CreateProductArgs) (Product, error) {
	row := pq.DB.QueryRow(ctx, `
		INSERT INTO products (
			store_id,
			name,
			slug,
			description,
			short_description,
			sku,
			weight,
			price,
			stock,
			category_id,
			images,
			attribute_group_id
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
		) ON CONFLICT (sku) DO NOTHING
		RETURNING *;
	`,
		args.StoreID,
		args.Name,
		args.Slug,
		args.ShortDescription,
		args.Description,
		args.Sku,
		args.Weight,
		args.Price,
		args.Stock,
		args.CategoryID,
		args.Images,
		args.AttributeGroupID,
	)
	var product Product
	err := row.Scan(
		&product.ID,
		&product.StoreID,
		&product.Name,
		&product.Slug,
		&product.Description,
		&product.ShortDescription,
		&product.Sku,
		&product.Weight,
		&product.Price,
		&product.Stock,
		&product.CategoryID,
		&product.Images,
		&product.IsVisible,
		&product.AttributeGroupID,
		&product.CreatedAt,
		&product.UpdatedAt,
	)
	return product, err
}

func (pq *ProductQueriesImpl) DeleteProduct(ctx context.Context, args DeleteProductArgs) (string, error) {
	row := pq.DB.QueryRow(ctx, `
		DELETE FROM products
		WHERE id = $1
		RETURNING name;
	`, args.ID)
	var productName string
	err := row.Scan(&productName)
	return productName, err
}

func (pq *ProductQueriesImpl) UpdateProduct(ctx context.Context, args UpdateProductArgs) (Product, error) {
	row := pq.DB.QueryRow(ctx, `
		UPDATE products
		SET 
			name = $2,
			slug = $3,
			description = $4,
			short_description = $5,
			sku = $6,
			weight = $7,
			price = $8,
			stock = $9,
			category_id = $10,
			images = $11,
			is_visible = $12,
			attribute_group_id = $13,
			updated_at = now()
		WHERE id = $1
		RETURNING *;
	`,
		args.ID,
		args.Name,
		args.Slug,
		args.Description,
		args.ShortDescription,
		args.Sku,
		args.Weight,
		args.Price,
		args.Stock,
		args.CategoryID,
		args.Images,
		args.IsVisible,
		args.AttributeGroupID,
	)
	var p Product
	err := row.Scan(
		&p.ID,
		&p.StoreID,
		&p.Name,
		&p.Slug,
		&p.Description,
		&p.ShortDescription,
		&p.Sku,
		&p.Weight,
		&p.Price,
		&p.Stock,
		&p.CategoryID,
		&p.Images,
		&p.IsVisible,
		&p.AttributeGroupID,
		&p.CreatedAt,
		&p.UpdatedAt,
	)
	return p, err
}
