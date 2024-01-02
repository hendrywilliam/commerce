"use server";

import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs";
import { slugify } from "@/lib/utils";
import { NewProduct } from "@/db/schema";
import type { UploadData } from "@/types";
import { UTApi } from "uploadthing/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { TweakedOmit } from "@/lib/utils";
import { products, stores } from "@/db/schema";
import { newProductValidation } from "@/lib/validations/product";

export async function addNewProductAction(
  input: TweakedOmit<NewProduct, "slug">,
  storeSlug: string,
) {
  const parsedNewProductInput = await newProductValidation.spa(input);
  const utapi = new UTApi();

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

  const product = await db.insert(products).values({
    ...input,
    slug: slugify(input.name),
    storeId: store.id,
    image: JSON.stringify(input.image),
  });

  if (!product) {
    // Fallback delete the files.
    const imageFileKeys = (input.image as UploadData[]).map(
      (image) => image.key,
    );

    await utapi.deleteFiles(imageFileKeys);
    throw new Error("Something went wrong. Please try again later.");
  }

  revalidatePath("/");
}
