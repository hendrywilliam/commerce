"use server";

import { db } from "@/db/core";
import { like } from "drizzle-orm";
import { Product } from "@/db/schema";
import { products } from "@/db/schema";

export async function get_products_search_fetcher(searchTerm: string) {
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
