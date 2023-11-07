"use server";

import { db } from "@/db/core";
import { Product, products } from "@/db/schema";
import { asc, desc } from "drizzle-orm";

// Add Options param later for ordering, limit, and etc.
export async function getAllProductsAction({
  sort,
  limit = 10,
}: {
  sort: string;
  limit?: number;
}) {
  const splitSort = sort
    ? (sort.split(".") as [keyof Product["name" | "createdAt"], "asc" | "desc"])
    : ["createdAt", "asc"];

  return await db
    .select()
    .from(products)
    .limit(10)
    .offset(0)
    .orderBy(
      splitSort && splitSort[0] === "name"
        ? splitSort[1] === "asc"
          ? asc(products.name)
          : desc(products.name)
        : asc(products.name),
      splitSort && splitSort[0] === "createdAt"
        ? splitSort[1] === "asc"
          ? asc(products.createdAt)
          : desc(products.createdAt)
        : asc(products.createdAt)
    );
}
