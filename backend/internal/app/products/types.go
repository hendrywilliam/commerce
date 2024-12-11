package products

import (
	"time"
)

type ProductImages struct {
	Url string `json:"image"`
}

type Product struct {
	ID               uint64    `json:"id"`
	StoreID          uint64    `json:"store_id"`
	Name             string    `json:"name"`
	Slug             string    `json:"slug"`
	Description      string    `json:"description"`
	ShortDescription string    `json:"short_description"`
	Sku              string    `json:"sku"`
	Weight           uint64    `json:"weight"`
	Price            float64   `json:"price"`
	Stock            uint64    `json:"stock"`
	CategoryID       uint64    `json:"category_id"`
	Images           []byte    `json:"images"`
	IsVisible        bool      `json:"is_visible"`
	AttributeGroupID uint64    `json:"attribute_group_id"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

type CreateProductRequest struct {
	StoreID          uint64          `json:"store_id" validate:"gte=1,required"`
	Name             string          `json:"name" validate:"required"`
	Slug             string          `json:"slug" validate:"required"`
	Description      string          `json:"description" validate:"required"`
	ShortDescription string          `json:"short_description" validate:"required"`
	Sku              string          `json:"sku" validate:"required"`
	Weight           uint64          `json:"weight" validate:"gte=1,required"`
	Price            float64         `json:"price" validate:"gte=1,required"`
	Stock            uint64          `json:"stock" validate:"gte=1,required"`
	CategoryID       uint64          `json:"category_id" validate:"required"`
	Images           []ProductImages `json:"images" validate:"required"`
	IsVisible        bool            `json:"is_visible" validate:"required"`
	AttributeGroupID uint64          `json:"attribute_group_id" validate:"gte=1,required"`
}

type CreateProductResponse struct {
	Name string `json:"name"`
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

type DeleteProductRequest struct {
	ID uint64 `query:"id" validate:"required"`
}

type DeleteProductResponse struct {
	Name string `json:"name"`
}

type DeleteProductArgs struct {
	ID uint64 `json:"id"`
}

type UpdateProductRequest struct {
	ID               uint64          `json:"id" validate:"required"`
	Name             string          `json:"name"`
	Slug             string          `json:"slug"`
	Description      string          `json:"description"`
	ShortDescription string          `json:"short_description"`
	Sku              string          `json:"sku"`
	Weight           uint64          `json:"weight" validate:"gte=1"`
	Price            float64         `json:"price" validate:"gte=1"`
	Stock            uint64          `json:"stock" validate:"gte=1"`
	CategoryID       uint64          `json:"category_id" validate:"gte=1"`
	Images           []ProductImages `json:"images"`
	IsVisible        bool            `json:"is_visible"`
	AttributeGroupID uint64          `json:"attribute_group_id" validate:"gte=1"`
}

type UpdateProductResponse struct {
	Name     string    `json:"name"`
	Slug     string    `json:"slug"`
	UpdateAt time.Time `json:"update_at"`
}

type UpdateProductArgs struct {
	ID               uint64          `json:"id" validate:"required"`
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
