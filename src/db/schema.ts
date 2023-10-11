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
  timestamp,
  boolean,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

export const products = mysqlTable("products", {
  id: serial("id").primaryKey(),
  storeId: int("store_id"),
  name: text("name"),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0"),
  stock: int("stock").default(0),
  rating: int("rating").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const productsRelations = relations(products, ({ one }) => ({
  store: one(stores, {
    fields: [products.storeId],
    references: [stores.id],
  }),
}));

export const stores = mysqlTable("stores", {
  id: serial("id").primaryKey(),
  name: varchar("name", {
    length: 255,
  }),
  description: text("description"),
  active: boolean("active").notNull().default(false),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const storesRelations = relations(stores, ({ many }) => ({
  products: many(products),
}));

export type Store = typeof stores.$inferSelect;
export type NewStore = typeof stores.$inferInsert;
