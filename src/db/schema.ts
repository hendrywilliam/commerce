import {
  integer,
  pgEnum,
  pgTable,
  serial,
  varchar,
  text,
  decimal,
  json,
  timestamp,
  boolean,
  index,
  smallint,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations, InferInsertModel, InferSelectModel } from "drizzle-orm";
import { CartItem, ProductWithQuantity, UploadData } from "@/types";

export const productCategoryEnum = pgEnum("category", [
  "clothing",
  "backpack",
  "shoes",
]);

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    storeId: integer("store_id"),
    name: varchar("name", { length: 256 }).notNull(),
    slug: varchar("slug", { length: 256 }).notNull(),
    description: text("description"),
    price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0"),
    stock: integer("stock").notNull().default(1),
    averageRatings: decimal("average_ratings", {
      precision: 2,
      scale: 1,
    }).default("0"),
    category: productCategoryEnum("category"),
    image: json("image").$type<UploadData[]>().notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => {
    return {
      // Enforces uniqueness to avoid collision.
      productSlugIndex: uniqueIndex("product_slug_index").on(table.slug),
      productNameIndex: uniqueIndex("product_name_index").on(table.name),
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

export const stores = pgTable(
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
      storeSlugIndex: uniqueIndex("store_slug_index").on(table.slug),
    };
  },
);

export const storesRelations = relations(stores, ({ many }) => ({
  products: many(products),
}));

export type Store = typeof stores.$inferSelect;
export type NewStore = typeof stores.$inferInsert;

export const carts = pgTable("carts", {
  id: serial("id").primaryKey(),
  items: json("items").$type<CartItem[]>(),
  isClosed: boolean("is_closed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Cart = typeof carts.$inferSelect;
export type NewCart = typeof carts.$inferInsert;

export const addresses = pgTable("addresses", {
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

export const orderPaymentStatusEnum = pgEnum("stripe_payment_intent_status", [
  "canceled",
  "processing",
  "succeeded",
]);

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", {
    length: 256,
  }),
  storeId: integer("store_id"),
  items: json("items").$type<ProductWithQuantity[]>(),
  total: decimal("total", { precision: 10, scale: 2 }).default("0"),
  name: text("name").notNull(),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", {
    length: 256,
  }),
  stripePaymentIntentStatus: orderPaymentStatusEnum(
    "stripe_payment_intent_status",
  ),
  email: text("email").notNull(),
  addressId: integer("address_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").notNull(),
  stripeAccountId: text("stripe_account_id").notNull(),
  detailsSubmitted: boolean("details_submitted").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;

export const newslettersEnum = pgEnum("subscription_status", [
  "subscribed",
  "unsubscribed",
]);

export const newsletters = pgTable("newsletters", {
  id: serial("id").primaryKey(),
  email: varchar("email", {
    length: 256,
  }).notNull(),
  status: newslettersEnum("subscription_status").default("unsubscribed"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Newsletter = InferSelectModel<typeof newsletters>;
export type NewNewsletter = InferInsertModel<typeof newsletters>;

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  productId: integer("product_id"),
  orderId: integer("order_id"),
  userId: varchar("user_id", {
    length: 256,
  }).notNull(), // Clerk based id, not an integer.
  fullname: varchar("fullname", {
    length: 256,
  }),
  content: text("content").notNull(),
  rating: smallint("rating").notNull().default(0),
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

export const ratings = pgTable("ratings", {
  id: serial("id").primaryKey(),
  productId: integer("product_id"),
  // oneStar to fiveStars indicate total rating for each star.
  oneStar: integer("one_star_rating").default(0),
  twoStars: integer("two_stars_rating").default(0),
  threeStars: integer("three_stars_rating").default(0),
  fourStars: integer("four_stars_rating").default(0),
  fiveStars: integer("five_stars_rating").default(0),
  accumulatedTotalRatings: integer("accumulated_total_ratings").default(0),
  totalRatings: integer("total_ratings").notNull().default(0),
});

export const ratingsRelations = relations(ratings, ({ one }) => ({
  products: one(products, {
    fields: [ratings.productId],
    references: [products.id],
  }),
}));

export type Rating = InferSelectModel<typeof ratings>;
export type NewRating = InferInsertModel<typeof ratings>;
