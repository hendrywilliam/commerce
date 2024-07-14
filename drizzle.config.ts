import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default defineConfig({
    schema: "./src/db/schema.ts",
    out: "./drizzle",
    dbCredentials: {
        //@ts-ignore
        url: process.env.DATABASE.URL as string,
    },
});
