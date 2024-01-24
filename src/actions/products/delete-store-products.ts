"use server";

import { db } from "@/db/core";
import { UploadData } from "@/types";
import { inArray } from "drizzle-orm";
import { Product } from "@/db/schema";
import { products } from "@/db/schema";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { delete_existing_images } from "@/lib/utils";
import { incomingProductValidation } from "@/lib/validations/product";

export async function deleteStoreProductsAction(selectedProducts: Product[]) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const parsedProduct = await incomingProductValidation.spa(selectedProducts);

  if (!parsedProduct.success) {
    throw new Error(parsedProduct.error.message);
  }

  const storeId = selectedProducts[0].storeId;
  const extractProductId = selectedProducts.map(
    (selectedProducts) => selectedProducts.id,
  );

  // Extract images key
  const productImagesKey = selectedProducts
    .map((item) => JSON.parse(item.image as string) as UploadData[])
    .flat();

  // Delete images and products
  await delete_existing_images(productImagesKey);
  await db.delete(products).where(inArray(products.id, extractProductId));

  revalidatePath(`/dashboard/stores/${storeId}`);
}
