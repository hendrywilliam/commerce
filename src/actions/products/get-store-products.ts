"use server";
import { db } from "@/db/core";
import { products, stores } from "@/db/schema";
import { eq } from "drizzle-orm";

// Add option for filtering/pagination/ordering later.
export async function getStoreProductsAction(storeId: string) {
  return await db
    .select({
      product: products,
      store: stores,
    })
    .from(products)
    .leftJoin(stores, eq(products.storeId, stores.id))
    .orderBy(products.id)
    .where(eq(products.storeId, Number(storeId)))
    .limit(10);
}
