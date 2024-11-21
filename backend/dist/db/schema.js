import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
import * as p from "drizzle-orm/pg-core";
export const products = p.pgTable("products", {
    id: p.serial("id").primaryKey(),
    storeId: p.integer("store_id"),
    name: p.varchar("name", { length: 255 }).notNull(),
    slug: p.varchar("slug", { length: 255 }).notNull(),
    description: p.text("description"),
    price: p.decimal("price", { precision: 15, scale: 2 }),
    stock: p.integer("stock").notNull().default(1),
    category: p.varchar("category", { length: 255 }),
    images: p
        .json("images")
        .$type()
        .notNull()
        .default(sql `'[]'::json`),
    createdAt: p.timestamp("created_at").defaultNow(),
    updatedAt: p.timestamp("updated_at").defaultNow(),
}, (table) => [
    p.uniqueIndex("product_slug_index").on(table.slug),
    p.uniqueIndex("product_name_index").on(table.name),
]);
export const productRelations = relations(products, ({ one, many }) => ({
    store: one(stores, {
        fields: [products.storeId],
        references: [stores.id],
    }),
}));
export const stores = p.pgTable("stores", {
    id: p.serial("id").primaryKey(),
    name: p.varchar("name", { length: 255 }).notNull(),
    slug: p.varchar("slug", { length: 255 }).notNull(),
    description: p.text("description").notNull(),
    active: p.boolean("active").notNull().default(false),
    createdAt: p.timestamp("created_at").defaultNow(),
    updatedAt: p.timestamp("updated_at").defaultNow(),
}, (table) => [p.uniqueIndex("store_slug_index").on(table.slug)]);
export const storesRelations = relations(stores, ({ many }) => ({
    products: many(products),
}));
export const carts = p.pgTable("carts", {
    id: p.serial("id").primaryKey(),
    items: p
        .json("items")
        .$type()
        .notNull()
        .default(sql `'[]'::json`),
    closed: p.boolean("closed").default(false),
    createdAt: p.timestamp("created_at").defaultNow(),
    updatedAt: p.timestamp("updated_at").defaultNow(),
});
