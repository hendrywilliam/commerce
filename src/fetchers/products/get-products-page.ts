"use server";

import { db } from "@/db/core";
import { products } from "@/db/schema";
import type { Product } from "@/db/schema";
import { unstable_noStore as noStore } from "next/cache";
import { and, inArray, sql, gte, lte } from "drizzle-orm";

// Page Size -> limit
// Offset -> page

export async function get_products_page_fetcher({
  pageSize,
  category,
  minPrice,
  maxPrice,
  sellers,
}: {
  pageSize: number;
  minPrice: string;
  maxPrice: string;
  sellers?: string;
  category?: string;
}) {
  noStore();
  const categories = category
    ? (category.split(".") as Pick<Product, "category">["category"][])
    : undefined;

  const sellersId = sellers
    ? sellers?.split(".").map((item) => Number(item))
    : undefined;

  const productsCount = (
    await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .limit(1)
      .where(
        and(
          categories ? inArray(products.category, categories) : undefined,
          sellersId ? inArray(products.storeId, sellersId) : undefined,
          minPrice ? gte(products.price, minPrice) : undefined,
          maxPrice ? lte(products.price, maxPrice) : undefined,
        ),
      )
  )[0].count;
  return Math.ceil(productsCount / pageSize);
}
