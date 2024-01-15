"use server";

import { db } from "@/db/core";
import { Product, products, stores } from "@/db/schema";
import { unstable_noStore as noStore } from "next/cache";
import { and, asc, desc, eq, gte, inArray, lte } from "drizzle-orm";

export async function get_all_products_and_store_fetcher({
  sort,
  pageSize,
  minPrice,
  maxPrice,
  sellers,
  category,
  page,
}: {
  sort: string;
  page: number;
  minPrice: string;
  maxPrice: string;
  pageSize: number;
  sellers?: string;
  category?: string;
}) {
  noStore();
  const [column, order] = sort
    ? (sort.split(".") as [keyof Product | undefined, "asc" | "desc"])
    : ["createdAt", "asc"];

  const sellersId = sellers
    ? sellers?.split(".").map((item) => Number(item))
    : undefined;

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
        sellersId ? inArray(products.storeId, sellersId) : undefined,
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
