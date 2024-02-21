import {
  int,
  mysqlEnum,
  mysqlTable,
  varchar,
  serial,
  text,
  decimal,
  timestamp,
  boolean,
  json,
  index,
  tinyint,
} from "drizzle-orm/mysql-core";
import { relations, InferInsertModel, InferSelectModel } from "drizzle-orm";

export const products = mysqlTable(
  "products",
  {
    id: serial("id").primaryKey(),
    storeId: int("store_id"),
    name: varchar("name", { length: 256 }).notNull(),
    slug: varchar("slug", { length: 256 }).notNull(),
    description: text("description"),
    price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0"),
    stock: int("stock").notNull().default(1),
    totalRating: decimal("total_rating", { precision: 2, scale: 1 })
      .notNull()
      .default("0"),
    category: mysqlEnum("category", [
      "clothing",
      "backpack",
      "shoes",
    ]).notNull(),
    image: json("image"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => {
    return {
      productSlugIndex: index("productSlugIndex").on(table.slug),
      productNameIndex: index("productNameIndex").on(table.name),
    };
  },
);

export const productsRelations = relations(products, ({ one, many }) => ({
  store: one(stores, {
    fields: [products.storeId],
    references: [stores.id],
  }),
  comments: many(comments),
}));

export type NewProduct = typeof products.$inferInsert;
export type Product = typeof products.$inferSelect;

export const stores = mysqlTable(
  "stores",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 256 }).notNull(),
    description: text("description").notNull(),
    active: boolean("active").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => {
    return {
      storeSlugIndex: index("storeSlugIndex").on(table.slug),
    };
  },
);

export const storesRelations = relations(stores, ({ many }) => ({
  products: many(products),
}));

export type Store = typeof stores.$inferSelect;
export type NewStore = typeof stores.$inferInsert;

export const carts = mysqlTable("carts", {
  id: serial("id").primaryKey(),
  items: json("items"),
  isClosed: boolean("is_closed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Cart = typeof carts.$inferSelect;
export type NewCart = typeof carts.$inferInsert;

export const addresses = mysqlTable("addresses", {
  id: serial("id").primaryKey(),
  line1: text("line1").notNull(),
  line2: text("line2"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  postal_code: text("postal_code").notNull(),
  country: text("country").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Address = typeof addresses.$inferSelect;
export type NewAddress = typeof addresses.$inferInsert;

export const orders = mysqlTable("orders", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", {
    length: 256,
  }),
  storeId: int("store_id"),
  items: json("items"),
  total: decimal("total", { precision: 10, scale: 2 }).default("0"),
  name: text("name").notNull(),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", {
    length: 256,
  }),
  stripePaymentIntentStatus: mysqlEnum("stripe_payment_intent_status", [
    "canceled",
    "processing",
    "succeeded",
  ]),
  email: text("email").notNull(),
  addressId: int("address"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

export const payments = mysqlTable("payments", {
  id: serial("id").primaryKey(),
  storeId: int("store_id").notNull(),
  stripeAccountId: text("stripe_account_id").notNull(),
  detailsSubmitted: boolean("details_submitted").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;

export const newsletters = mysqlTable("newsletters", {
  id: serial("id").primaryKey(),
  email: varchar("email", {
    length: 256,
  }).notNull(),
  status: mysqlEnum("status", ["subscribed", "unsubscribed"]).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Newsletter = InferSelectModel<typeof newsletters>;
export type NewNewsletter = InferInsertModel<typeof newsletters>;

export const comments = mysqlTable("comments", {
  id: serial("id").primaryKey(),
  productId: int("product_id"),
  orderId: int("order_id"),
  userId: varchar("user_id", {
    length: 256,
  }).notNull(),
  fullname: varchar("fullname", {
    length: 256,
  }),
  comment: text("comment").notNull(),
  rating: tinyint("rating").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const commentsRelations = relations(comments, ({ one }) => ({
  products: one(products, {
    fields: [comments.productId],
    references: [products.id],
  }),
}));

export type Comment = InferSelectModel<typeof comments>;
export type NewComment = InferInsertModel<typeof comments>;
