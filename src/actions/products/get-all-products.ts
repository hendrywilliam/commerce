"use server";

import { db } from "@/db/core";
import { Product, products } from "@/db/schema";
import { and, asc, desc, gte, lte } from "drizzle-orm";

export async function getAllProductsAction({
  sort,
  offset,
  limit = 10,
  minPrice,
  maxPrice,
}: {
  sort: string;
  offset: number;
  limit?: number;
  minPrice: string;
  maxPrice: string;
}) {
  const [column, order] = sort
    ? (sort.split(".") as [keyof Product | undefined, "asc" | "desc"])
    : ["createdAt", "asc"];

  return await db
    .select()
    .from(products)
    .limit(limit)
    .offset(offset)
    .where(
      and(
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
