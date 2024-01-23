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
import { check_product_availability_action } from "./check-product-availability";

async function fallback_delete_images(images: NewProduct["image"]) {
  const utapi = new UTApi();
  const imageFileKeys = (images as UploadData[]).map((image) => image.key);
  return await utapi.deleteFiles(imageFileKeys);
}

export async function addNewProductAction(
  input: TweakedOmit<NewProduct, "slug">,
  storeSlug: string,
) {
  const parsedNewProductInput = await newProductValidation.spa(input);

  if (!parsedNewProductInput.success) {
    await fallback_delete_images(input.image);

    throw new Error(parsedNewProductInput.error.message);
  }

  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  await check_product_availability_action({
    productName: input.name,
  });

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
    await fallback_delete_images(input.image);
  }

  revalidatePath("/");
}
