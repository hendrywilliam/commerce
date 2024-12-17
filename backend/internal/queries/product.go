package queries

import (
	"context"
	"errors"
	"time"
)

var (
	ErrDuplicateProduct = errors.New("Duplicate product detected.")
	ErrNoProduct        = errors.New("Product is not exist.")
	ErrStockExceeds     = errors.New("Stock limit exceeds.")
)

type ProductImages struct {
	Url string `json:"image"`
}

type Product struct {
	ID               uint64          `json:"id,omitempty"`
	StoreID          uint64          `json:"store_id,omitempty"`
	Name             string          `json:"name,omitempty"`
	NameSearch       string          `json:"name_search,omitempty"`
	Slug             string          `json:"slug,omitempty"`
	Description      string          `json:"description,omitempty"`
	ShortDescription string          `json:"short_description,omitempty"`
	Sku              string          `json:"sku,omitempty"`
	Weight           uint64          `json:"weight,omitempty"`
	Price            float64         `json:"price,omitempty"`
	Stock            uint64          `json:"stock,omitempty"`
	CategoryID       uint64          `json:"category_id,omitempty"`
	Images           []ProductImages `json:"images,omitempty"`
	IsVisible        bool            `json:"is_visible,omitempty"`
	AttributeGroupID uint64          `json:"attribute_group_id,omitempty"`
	CreatedAt        *time.Time      `json:"created_at,omitempty"`
	UpdatedAt        *time.Time      `json:"updated_at,omitempty"`
}

type ProductQueriesImpl struct {
	DB DbTx
}

func (pq *ProductQueriesImpl) SearchProducts(ctx context.Context, searchTerm string) ([]Product, error) {
	rows, err := pq.DB.Query(ctx, `
		SELECT
			name,
			slug,
			description,
			stock
		FROM 
			products
		WHERE 
			name_search @@ to_tsquery($1);
	`, searchTerm)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	products := []Product{}
	for rows.Next() {
		var product Product
		if err = rows.Scan(&product.Name, &product.Slug, &product.Description, &product.Stock); err != nil {
			return nil, err
		}
		products = append(products, product)
	}
	return products, err
}

func (pq *ProductQueriesImpl) GetProduct(ctx context.Context, ID uint64) (Product, error) {
	row := pq.DB.QueryRow(ctx, `
		SELECT 
			id,
			stock,
			name
		FROM 
			products
		WHERE 
			id = $1;
	`, ID)
	var p Product
	err := row.Scan(
		&p.ID,
		&p.Stock,
		&p.Name,
	)
	return p, err
}

func (pq *ProductQueriesImpl) GetProductBySlug(ctx context.Context, slug string) (Product, error) {
	row := pq.DB.QueryRow(ctx, `
		SELECT
			id,
			stock,
			name
		FROM 
			products
		WHERE
			slug = $1
	`, slug)
	var p Product
	err := row.Scan(
		&p.ID,
		&p.Stock,
		&p.Name,
	)
	return p, err
}

type CreateProductArgs struct {
	StoreID          uint64          `json:"store_id"`
	Name             string          `json:"name"`
	Slug             string          `json:"slug"`
	Description      string          `json:"description"`
	ShortDescription string          `json:"short_description"`
	Sku              string          `json:"sku"`
	Weight           uint64          `json:"weight"`
	Price            float64         `json:"price"`
	Stock            uint64          `json:"stock"`
	CategoryID       uint64          `json:"category_id"`
	Images           []ProductImages `json:"image"`
	AttributeGroupID uint64          `json:"attribute_group_id"`
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
		RETURNING id, name;
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
		&product.Name,
	)
	return product, err
}

func (pq *ProductQueriesImpl) DeleteProduct(ctx context.Context, ID uint64) (string, error) {
	row := pq.DB.QueryRow(ctx, `
		DELETE FROM products
		WHERE id = $1
		RETURNING name;
	`, ID)
	var productName string
	err := row.Scan(&productName)
	return productName, err
}

type UpdateProductArgs struct {
	ID               uint64          `json:"id"`
	Name             string          `json:"name"`
	Slug             string          `json:"slug"`
	Description      string          `json:"description"`
	ShortDescription string          `json:"short_description"`
	Sku              string          `json:"sku"`
	Weight           uint64          `json:"weight"`
	Price            float64         `json:"price"`
	Stock            uint64          `json:"stock"`
	CategoryID       uint64          `json:"category_id"`
	Images           []ProductImages `json:"images"`
	IsVisible        bool            `json:"is_visible"`
	AttributeGroupID uint64          `json:"attribute_group_id"`
}

func (pq *ProductQueriesImpl) UpdateProduct(ctx context.Context, args UpdateProductArgs) (Product, error) {
	row := pq.DB.QueryRow(ctx, `
		UPDATE 
			products
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
		WHERE 
			id = $1
		RETURNING name;
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
		&p.Name,
	)
	return p, err
}
