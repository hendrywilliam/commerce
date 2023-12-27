"use server";

import { db } from "@/db/core";
import { auth } from "@clerk/nextjs";
import { slugify } from "@/lib/utils";
import { products, stores } from "@/db/schema";
import { NewProduct } from "@/db/schema";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { TweakedOmit } from "@/lib/utils";
import { newProductValidation } from "@/lib/validations/product";
import { eq } from "drizzle-orm";

export async function addNewProductAction(
  input: TweakedOmit<NewProduct, "slug">,
  storeSlug: string,
) {
  const parsedNewProductInput = await newProductValidation.spa(input);

  if (!parsedNewProductInput.success) {
    throw new Error(parsedNewProductInput.error.message);
  }

  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const newProductIsExistInStore = await db.query.products.findFirst({
    where: (products, { eq }) => eq(products.name, input.name as string),
  });

  if (newProductIsExistInStore) {
    throw new Error("Product already exist in the store.");
  }

  const store = await db.query.stores
    .findFirst({
      where: eq(stores.slug, storeSlug),
    })
    .execute();

  if (!store) {
    throw new Error("Store is not exist anymore, try again later.");
  }

  await db.insert(products).values({
    ...input,
    slug: slugify(input.name),
    storeId: store.id,
    image: JSON.stringify(input.image),
  });
  revalidatePath("/");
}
