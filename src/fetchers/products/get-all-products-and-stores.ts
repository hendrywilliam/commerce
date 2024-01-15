"use server";

import { db } from "@/db/core";
import { Product, products, stores } from "@/db/schema";
import { unstable_noStore as noStore } from "next/cache";
import { and, asc, desc, eq, gte, inArray, lte } from "drizzle-orm";

// Page Size -> limit
// Offset -> page

export async function get_all_products_and_store_fetcher({
  sort,
  minPrice,
  maxPrice,
  sellers,
  category,
  pageSize = 10,
  page = 1,
}: {
  sort?: string;
  page?: number;
  sellers?: string;
  maxPrice?: string;
  minPrice?: string;
  pageSize?: number;
  category?: string;
}) {
  noStore();
  const [column, order] = sort
    ? (sort.split(".") as [keyof Product | undefined, "asc" | "desc"])
    : ["createdAt", "asc"];

  const sellersSlug = sellers ? sellers.split(".") : undefined;

  const categories = category
    ? (category.split(".") as Pick<Product, "category">["category"][])
    : undefined;

  return await db
    .select({
      products: products,
      stores: stores,
    })
    .from(products)
    .leftJoin(stores, eq(products.storeId, stores.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize)
    .where(
      and(
        categories ? inArray(products.category, categories) : undefined,
        sellersSlug ? inArray(stores.slug, sellersSlug) : undefined,
        minPrice ? gte(products.price, minPrice) : undefined,
        maxPrice ? lte(products.price, maxPrice) : undefined,
      ),
    )
    .orderBy(
      column && column in products
        ? order === "asc"
          ? // @ts-expect-error
            asc(products[column])
          : // @ts-expect-error
            desc(products[column])
        : desc(products.createdAt),
    )
    .groupBy(products.id);
}
