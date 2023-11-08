"use server";

import { db } from "@/db/core";
import { products } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { Product } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function deleteStoreProductsAction(desireProducts: Product[]) {
  const storeId = desireProducts[0].storeId;
  const extractProductId = desireProducts.map(
    (desireProduct) => desireProduct.id
  );

  await db.delete(products).where(inArray(products.id, extractProductId));

  revalidatePath(`/dashboard/stores/${storeId}`);
}
