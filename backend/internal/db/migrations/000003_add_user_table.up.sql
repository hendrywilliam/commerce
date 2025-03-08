CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    "sub" varchar(50) UNIQUE DEFAULT '',
    "email" varchar(255) UNIQUE NOT NULL,
    "fullname" varchar(255) DEFAULT '',
    "password" varchar(255) DEFAULT '',
    "image_url" text DEFAULT '',
    "authentication_type" varchar(255),
    "private_metadata" json DEFAULT '{}',
    "created_at" timestamptz NOT NULL DEFAULT (now()),
    "updated_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE UNIQUE INDEX ON "users" ("email");