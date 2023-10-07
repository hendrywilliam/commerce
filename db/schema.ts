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
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", {
    length: 50,
  }),
  email: varchar("email", {
    length: 255,
  }).unique(),
  fullname: varchar("fullname", {
    length: 255,
  }),
  address: text("address"),
});

export const products = mysqlTable("product", {
  id: serial("id").primaryKey(),
  productName: text("product_name"),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).default("0"),
  stock: int("stock").default(0),
});

export const stores = mysqlTable("stores", {
  id: serial("id").primaryKey(),
  userId: serial("user_id"),
  storeName: varchar("storename", {
    length: 255,
  }),
  description: text("description"),
});

// relations section

// 1-to-many user -> stores
export const useRelations = relations(users, ({ many }) => ({
  stores: many(stores),
}));

export const storeRelations = relations(stores, ({ one }) => ({
  user: one(users, {
    fields: [stores.userId],
    references: [users.id],
  }),
}));
