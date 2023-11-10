"use server";

import { db } from "@/db/core";
import { Product, products, stores } from "@/db/schema";
import { and, asc, desc, eq, gte, inArray, lte } from "drizzle-orm";

export async function getAllProductsAndStoresAction({
  sort,
  offset,
  limit = 8,
  minPrice,
  maxPrice,
  sellers,
  category,
}: {
  sort: string;
  offset: number;
  minPrice: string;
  maxPrice: string;
  category?: string;
  sellers?: string;
  limit?: number;
}) {
  const [column, order] = sort
    ? (sort.split(".") as [keyof Product | undefined, "asc" | "desc"])
    : ["createdAt", "asc"];

  const sellersId =
    sellers !== "all"
      ? sellers?.split(".").map((item) => Number(item))
      : undefined;

  const categories = category ? category.split(".") : undefined;

  return await db
    .select({
      products: products,
      stores: stores,
    })
    .from(products)
    .leftJoin(stores, eq(products.storeId, stores.id))
    .limit(limit)
    .offset(offset)
    .where(
      and(
        categories ? inArray(products.category, categories) : undefined,
        sellersId ? inArray(products.storeId, sellersId) : undefined,
        minPrice ? gte(products.price, minPrice) : undefined,
        maxPrice ? lte(products.price, maxPrice) : undefined
      )
    )
    .orderBy(
      column && column in products
        ? order === "asc"
          ? // @ts-expect-error
            asc(products[column])
          : // @ts-expect-error
            desc(products[column])
        : desc(products.createdAt)
    )
    .groupBy(products.id);
}
