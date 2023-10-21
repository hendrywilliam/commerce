"use server";
import { db } from "@/db/core";
import { products } from "@/db/schema";
import { like } from "drizzle-orm";

export async function getProductsBySearchTermAction(searchTerm: string) {
  return await db
    .select({
      id: products.id,
      name: products.name,
      category: products.category,
    })
    .from(products)
    .where(like(products.name, `%${searchTerm}%`));
}
