import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";
import * as dotenv from "dotenv";
dotenv.config();
import * as schema from "@/db/schema";

// initialize connection to database
const connection = connect({
  host: process.env["DATABASE_HOST"],
  username: process.env["DATABASE_USERNAME"],
  password: process.env["DATABASE_PASSWORD"],
});

// import db
export const db = drizzle(connection, { schema });
