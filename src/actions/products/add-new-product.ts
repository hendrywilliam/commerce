"use server";

import { db } from "@/db/core";
import { auth } from "@clerk/nextjs";
import { slugify } from "@/lib/utils";
import { products } from "@/db/schema";
import { NewProduct } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function addNewProductAction(input: Omit<NewProduct, "slug">) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("You must be signed in to add a new product.");
  }

  const newProductIsExistInStore = await db.query.products.findFirst({
    where: (products, { eq }) => eq(products.name, input.name as string),
  });

  if (newProductIsExistInStore) {
    throw new Error("Product already exist in the store.");
  }

  await db.insert(products).values({ ...input, slug: slugify(input.name) });
  revalidatePath("/");
}
