package queries

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"log/slog"
	"strings"
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

func (p Product) LogValue() slog.Value {
	return slog.GroupValue(
		slog.Uint64("id", p.ID),
		slog.Uint64("store_id", p.ID),
		slog.String("name", p.Name),
		slog.String("name_search", p.Name),
		slog.String("slug", p.Slug),
		slog.Float64("price", p.Price),
		slog.Bool("is_visible", p.IsVisible),
	)
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
	Name             *string         `json:"name"`
	Slug             *string         `json:"slug"`
	Description      *string         `json:"description"`
	ShortDescription *string         `json:"short_description"`
	Sku              *string         `json:"sku"`
	Weight           *uint64         `json:"weight"`
	Price            *float64        `json:"price"`
	Stock            *uint64         `json:"stock"`
	CategoryID       *uint64         `json:"category_id"`
	Images           []ProductImages `json:"images"`
	IsVisible        *bool           `json:"is_visible"`
	AttributeGroupID *uint64         `json:"attribute_group_id"`
}

func (pq *ProductQueriesImpl) UpdateProduct(ctx context.Context, args UpdateProductArgs) (Product, error) {
	baseSql := &bytes.Buffer{}
	baseSql.WriteString("UPDATE products SET ")
	var params []interface{}
	var setClauses []string
	paramIndex := 1
	if args.Name != nil {
		params = append(params, args.Name)
		setClauses = append(setClauses, fmt.Sprintf("name = $%d", paramIndex))
		paramIndex++
	}
	if args.Slug != nil {
		params = append(params, args.Slug)
		setClauses = append(setClauses, fmt.Sprintf("slug = $%d", paramIndex))
		paramIndex++
	}
	if args.Description != nil {
		params = append(params, args.Description)
		setClauses = append(setClauses, fmt.Sprintf("description = $%d", paramIndex))
		paramIndex++
	}
	if args.ShortDescription != nil {
		params = append(params, args.ShortDescription)
		setClauses = append(setClauses, fmt.Sprintf("short_description = $%d", paramIndex))
		paramIndex++
	}
	if args.Sku != nil {
		params = append(params, args.Sku)
		setClauses = append(setClauses, fmt.Sprintf("sku = $%d", paramIndex))
		paramIndex++
	}
	if args.Weight != nil {
		params = append(params, args.Weight)
		setClauses = append(setClauses, fmt.Sprintf("weight = $%d", paramIndex))
		paramIndex++
	}
	if args.Price != nil {
		params = append(params, args.Price)
		setClauses = append(setClauses, fmt.Sprintf("price = $%d", paramIndex))
		paramIndex++
	}
	if args.Stock != nil {
		params = append(params, args.Stock)
		setClauses = append(setClauses, fmt.Sprintf("stock = $%d", paramIndex))
		paramIndex++
	}
	if args.CategoryID != nil {
		params = append(params, args.CategoryID)
		setClauses = append(setClauses, fmt.Sprintf("stock = $%d", paramIndex))
		paramIndex++
	}
	if args.Images != nil {
		params = append(params, args.Images)
		setClauses = append(setClauses, fmt.Sprintf("images = $%d", paramIndex))
		paramIndex++
	}
	if args.IsVisible != nil {
		params = append(params, args.IsVisible)
		setClauses = append(setClauses, fmt.Sprintf("is_visible = $%d", paramIndex))
		paramIndex++
	}
	if args.AttributeGroupID != nil {
		params = append(params, args.AttributeGroupID)
		setClauses = append(setClauses, fmt.Sprintf("attribute_group_id = $%d", paramIndex))
		paramIndex++
	}
	if len(setClauses) == 0 {
		return Product{}, errors.New("no fields were updated")
	}
	setClauses = append(setClauses, fmt.Sprintf("updated_at = now()"))
	baseSql.WriteString(strings.Join(setClauses, ", "))
	baseSql.WriteString(fmt.Sprintf(" WHERE id = $%d RETURNING name;", paramIndex))
	params = append(params, args.ID)
	row := pq.DB.QueryRow(ctx, baseSql.String(), params...)
	var p Product
	err := row.Scan(
		&p.Name,
	)
	return p, err
}
