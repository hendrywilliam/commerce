"use server";

import { db } from "@/db/core";
import { products } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function getShoesCount() {
  return (
    await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(eq(products.category, "shoes"))
  )[0].count;
}

export async function getClothingCount() {
  return (
    await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(eq(products.category, "clothing"))
  )[0].count;
}

export async function getBackpackCount() {
  return (
    await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(eq(products.category, "backpack"))
  )[0].count;
}
