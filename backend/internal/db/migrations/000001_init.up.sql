CREATE TABLE "products" (
  "id" serial PRIMARY KEY,
  "store_id" integer,
  "name" varchar(255) UNIQUE NOT NULL,
  "slug" varchar(255) UNIQUE NOT NULL,
  "description" text NOT NULL,
  "short_description" text,
  "sku" varchar(255) UNIQUE NOT NULL, 
  "weight" integer NOT NULL DEFAULT 0,
  "price" decimal(15,6) NOT NULL DEFAULT 0,
  "stock" integer NOT NULL DEFAULT 0,
  "category_id" integer NOT NULL,
  "images" json DEFAULT '[]',
  "is_visible" bool NOT NULL DEFAULT true,
  "attribute_group_id" integer NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "updated_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "attributes" (
  "id" serial PRIMARY KEY,
  "name" varchar(255),
  "is_required" bool NOT NULL DEFAULT true,
  "is_visible" bool NOT NULL DEFAULT true,
  "group_id" int NOT NULL,
  "options" json DEFAULT '[]',
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "updated_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "attribute_groups" (
  "id" serial PRIMARY KEY,
  "name" varchar(255) UNIQUE NOT NULL,
  "description" text,
  "store_id" int NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "updated_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "categories" (
  "id" serial PRIMARY KEY,
  "name" varchar(255) UNIQUE NOT NULL,
  "description" text NOT NULL
);

CREATE TABLE "stores" (
  "id" serial PRIMARY KEY,
  "name" varchar(255) UNIQUE NOT NULL,
  "slug" varchar(255) UNIQUE NOT NULL,
  "description" text NOT NULL,
  "active" bool NOT NULL DEFAULT false,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "updated_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE UNIQUE INDEX ON "products" ("slug", "name");

CREATE UNIQUE INDEX ON "stores" ("slug");

ALTER TABLE "products" ADD FOREIGN KEY ("store_id") REFERENCES "stores" ("id");

ALTER TABLE "products" ADD FOREIGN KEY ("category_id") REFERENCES "categories" ("id");

ALTER TABLE "attributes" ADD FOREIGN KEY ("group_id") REFERENCES "attribute_groups" ("id");

ALTER TABLE "attribute_groups" ADD FOREIGN KEY ("store_id") REFERENCES "stores" ("id");