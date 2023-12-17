"use server";

import { db } from "@/db/core";
import { inArray } from "drizzle-orm";
import { Product } from "@/db/schema";
import { products } from "@/db/schema";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { bulkProductsValidation } from "@/lib/validations/product";

export async function deleteStoreProductsAction(desireProducts: Product[]) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const parsedProduct = await bulkProductsValidation.spa(desireProducts);

  if (!parsedProduct.success) {
    throw new Error(parsedProduct.error.message);
  }

  const storeId = desireProducts[0].storeId;
  const extractProductId = desireProducts.map(
    (desireProduct) => desireProduct.id,
  );

  await db.delete(products).where(inArray(products.id, extractProductId));

  revalidatePath(`/dashboard/stores/${storeId}`);
}
