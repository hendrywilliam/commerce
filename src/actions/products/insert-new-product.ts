"use server";

import { NewProduct } from "@/db/schema";
import { db } from "@/db/core";
import { products } from "@/db/schema";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

export async function insertNewProduct(input: NewProduct) {
  const { userId } = auth();

  // Middleware will handle this.
  if (!userId) {
    throw new Error("You must be signed in to add a new product.");
  }

  const newProductIsExistInStore = await db.query.products.findFirst({
    where: (products, { eq }) => eq(products.name, input.name as string),
  });

  if (newProductIsExistInStore) {
    throw new Error("Product already exist in the store.");
  }

  await db.insert(products).values({ ...input });
  revalidatePath("/");
}
