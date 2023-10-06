import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";
import { migrate } from "drizzle-orm/mysql2/migrator";

// initialize connection to database
const connection = connect({
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
});

// import db
export const db = drizzle(connection);

// sync migration folder (./drizzle) folder to database
process.env.NODE_ENV === "development" &&
  migrate(db as any, {
    migrationsFolder: "./drizzle",
  })
    .then((res) => res)
    .catch((err) => console.log("Migration error in db.ts", err));
