CREATE TABLE "carts" (
    "id" SERIAL PRIMARY KEY,
    "items" json DEFAULT '[]',
    "is_closed" bool NOT NULL DEFAULT false,
    "created_at" timestamptz NOT NULL DEFAULT (now()),
    "updated_at" timestamptz NOT NULL DEFAULT (now())
)