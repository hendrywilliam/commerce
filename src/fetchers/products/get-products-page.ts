"use server";

import { db } from "@/db/core";
import type { Product } from "@/db/schema";
import { products, stores } from "@/db/schema";
import { unstable_noStore as noStore } from "next/cache";
import { and, inArray, sql, gte, lte, eq } from "drizzle-orm";

export async function get_products_page_fetcher({
  pageSize = 10,
  category,
  minPrice,
  maxPrice,
  sellers,
  rating,
}: {
  pageSize?: number;
  minPrice?: string;
  maxPrice?: string;
  sellers?: string;
  category?: string;
  rating?: string;
}) {
  noStore();
  const categories = category
    ? (category.split(".") as Pick<Product, "category">["category"][])
    : undefined;

  const sellersSlug = sellers ? sellers?.split(".") : undefined;

  const productsCount = (
    await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .leftJoin(stores, eq(products.storeId, stores.id))
      .limit(1)
      .where(
        and(
          rating ? gte(products.averageRatings, rating) : undefined,
          categories ? inArray(products.category, categories) : undefined,
          sellersSlug ? inArray(stores.slug, sellersSlug) : undefined,
          minPrice ? gte(products.price, minPrice) : undefined,
          maxPrice ? lte(products.price, maxPrice) : undefined,
        ),
      )
  )[0].count;

  return Math.ceil(productsCount / pageSize);
}
