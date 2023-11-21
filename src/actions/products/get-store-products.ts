"use server";
import { db } from "@/db/core";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

// Add option for filtering/pagination/ordering later.
export async function getStoreProductsAction(storeId: string) {
  return await db
    .select()
    .from(products)
    .orderBy(products.id)
    .where(eq(products.storeId, Number(storeId)))
    .limit(10);
}
