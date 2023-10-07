import {
  int,
  mysqlEnum,
  mysqlTable,
  bigint,
  uniqueIndex,
  varchar,
  serial,
  text,
  decimal,
  index,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

export const products = mysqlTable("product", {
  id: serial("id").primaryKey(),
  storeId: int("store_id"),
  productName: text("product_name"),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).default("0"),
  stock: int("stock").default(0),
});

// products relation
export const productsRelations = relations(products, ({ one }) => ({
  store: one(stores, {
    fields: [products.storeId],
    references: [stores.id],
  }),
}));

export const stores = mysqlTable("stores", {
  id: serial("id").primaryKey(),
  userId: serial("user_id"),
  storeName: varchar("storename", {
    length: 255,
  }),
  description: text("description"),
});

// stores relation
export const storesRelations = relations(stores, ({ many }) => ({
  products: many(products),
}));
