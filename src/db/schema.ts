import {
  int,
  mysqlEnum,
  mysqlTable,
  varchar,
  serial,
  text,
  decimal,
  index,
  timestamp,
  boolean,
  json,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

export const products = mysqlTable("products", {
  id: serial("id").primaryKey(),
  storeId: int("store_id"),
  name: text("name"),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0"),
  stock: int("stock").notNull().default(1),
  rating: int("rating").notNull().default(0),
  category: mysqlEnum("category", ["clothing", "backpack", "shoes"]).notNull(),
  image: json("image"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const productsRelations = relations(products, ({ one }) => ({
  store: one(stores, {
    fields: [products.storeId],
    references: [stores.id],
  }),
}));

export type NewProduct = typeof products.$inferInsert;
export type Product = typeof products.$inferSelect;

export const stores = mysqlTable("stores", {
  id: serial("id").primaryKey(),
  name: varchar("name", {
    length: 255,
  }).notNull(),
  description: text("description").notNull(),
  active: boolean("active").notNull().default(false),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const storesRelations = relations(stores, ({ many }) => ({
  products: many(products),
}));

export type Store = typeof stores.$inferSelect;
export type NewStore = typeof stores.$inferInsert;

export const carts = mysqlTable("carts", {
  id: serial("id").primaryKey(),
  items: json("items"),
  isClosed: boolean("isClosed").default(false),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Cart = typeof carts.$inferSelect;
export type NewCart = typeof carts.$inferInsert;

export const addresses = mysqlTable("addresses", {
  id: serial("id").primaryKey(),
  line1: text("line1"),
  line2: text("line2"),
  city: text("city"),
  state: text("state"),
  postal_code: text("postal_code"),
  country: text("country"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Address = typeof addresses.$inferSelect;
export type NewAddress = typeof addresses.$inferInsert;

export const orders = mysqlTable("orders", {
  id: serial("id").primaryKey(),
  storeId: int("store_id"),
  items: json("items"),
  total: decimal("total", { precision: 10, scale: 2 }).default("0"),
  name: text("name"),
  email: text("email"),
  addressId: int("address"),
  createdAt: timestamp("createdAt").defaultNow(),
});
