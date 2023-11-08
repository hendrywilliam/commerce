"use server";
import { db } from "@/db/core";
import { products } from "@/db/schema";
import { like } from "drizzle-orm";
import { Product } from "@/db/schema";

export async function getProductsBySearchTermAction(searchTerm: string) {
  const result = (
    await db
      .select({
        id: products.id,
        name: products.name,
        category: products.category,
      })
      .from(products)
      .where(like(products.name, `%${searchTerm}%`))
  ).reduce(
    (group, product) => {
      const { category } = product;
      group[category] = group[category] ?? [];
      group[category].push(product);
      return group;
    },
    {} as Record<string, Pick<Product, "name" | "id" | "category">[]>
  );

  return result;
}
