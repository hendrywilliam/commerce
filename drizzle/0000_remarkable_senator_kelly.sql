DO $$ BEGIN
 CREATE TYPE "subscription_status" AS ENUM('subscribed', 'unsubscribed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "stripe_payment_intent_status" AS ENUM('canceled', 'processing', 'succeeded');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "category" AS ENUM('clothing', 'backpack', 'shoes');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "addresses" (
	"id" serial PRIMARY KEY NOT NULL,
	"line1" text NOT NULL,
	"line2" text,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"postal_code" text NOT NULL,
	"country" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "carts" (
	"id" serial PRIMARY KEY NOT NULL,
	"items" json,
	"is_closed" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer,
	"order_id" integer,
	"user_id" varchar(256) NOT NULL,
	"fullname" varchar(256),
	"content" text NOT NULL,
	"rating" smallint DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "newsletters" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(256) NOT NULL,
	"subscription_status" "subscription_status" DEFAULT 'unsubscribed',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(256),
	"store_id" integer,
	"items" json,
	"total" numeric(10, 2) DEFAULT '0',
	"name" text NOT NULL,
	"stripe_payment_intent_id" varchar(256),
	"stripe_payment_intent_status" "stripe_payment_intent_status",
	"email" text NOT NULL,
	"address_id" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"store_id" integer NOT NULL,
	"stripe_account_id" text NOT NULL,
	"details_submitted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"store_id" integer,
	"name" varchar(256) NOT NULL,
	"slug" varchar(256) NOT NULL,
	"description" text,
	"price" numeric(10, 2) DEFAULT '0' NOT NULL,
	"stock" integer DEFAULT 1 NOT NULL,
	"average_ratings" numeric(2, 1) DEFAULT '0',
	"category" "category",
	"image" json,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ratings" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer,
	"one_star_rating" integer DEFAULT 0,
	"two_stars_rating" integer DEFAULT 0,
	"three_stars_rating" integer DEFAULT 0,
	"four_stars_rating" integer DEFAULT 0,
	"five_stars_rating" integer DEFAULT 0,
	"total_ratings" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stores" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(256) NOT NULL,
	"description" text NOT NULL,
	"active" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "product_slug_index" ON "products" ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "product_name_index" ON "products" ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "store_slug_index" ON "stores" ("slug");