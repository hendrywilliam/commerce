"use server";

import { db } from "@/db/core";
import { eq, sql } from "drizzle-orm";
import { products } from "@/db/schema";
import { unstable_noStore as noStore } from "next/cache";

export async function getAllProductsCount() {
  noStore();
  return await db.transaction(async (tx) => {
    const shoesCount = (
      await db
        .select({ count: sql<number>`count(*)` })
        .from(products)
        .where(eq(products.category, "shoes"))
        .limit(1)
    )[0].count;
    const clothingCount = (
      await db
        .select({ count: sql<number>`count(*)` })
        .from(products)
        .where(eq(products.category, "clothing"))
        .limit(1)
    )[0].count;
    const backpackCount = (
      await db
        .select({ count: sql<number>`count(*)` })
        .from(products)
        .where(eq(products.category, "backpack"))
        .limit(1)
    )[0].count;
    return [shoesCount, clothingCount, backpackCount];
  });
}
