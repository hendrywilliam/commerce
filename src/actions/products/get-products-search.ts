"use server";
import { db } from "@/db/core";
import { products } from "@/db/schema";
import { like } from "drizzle-orm";
import { Product } from "@/db/schema";

export async function getProductsBySearchTermAction(searchTerm: string) {
  const result = (
    await db
      .select()
      .from(products)
      .where(like(products.name, `%${searchTerm}%`))
  ).reduce(
    (group, product) => {
      const { category } = product;
      group[category] = group[category] ?? [];
      group[category].push(product);
      return group;
    },
    {} as Record<Product["category"], Product[]>,
  );

  return result;
}
