CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    "email" varchar(255) UNIQUE NOT NULL,
    "password" varchar(255),
    "private_metadata" json DEFAULT '{}',
    "created_at" timestamptz NOT NULL DEFAULT (now()),
    "updated_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE UNIQUE INDEX ON "users" ("email");