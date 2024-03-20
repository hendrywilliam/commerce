"use server";

import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs";
import { slugify } from "@/lib/utils";
import { NewProduct, ratings } from "@/db/schema";
import type { UploadData } from "@/types";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { products, stores } from "@/db/schema";
import { newProductValidation } from "@/lib/validations/product";
import { delete_existing_images, type OmitAndExtend } from "@/lib/utils";
import { checkProductAvailabilityAction } from "./check-product-availability";

export async function addNewProductAction(
  input: OmitAndExtend<NewProduct, "slug" | "image", { image: UploadData[] }>,
  storeSlug: string,
) {
  const parsedNewProductInput = await newProductValidation.spa(input);

  if (!parsedNewProductInput.success) {
    if (input.image.length) {
      await delete_existing_images(input.image);
    }
    throw new Error(parsedNewProductInput.error.issues[0].message);
  }

  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  await checkProductAvailabilityAction({
    productName: parsedNewProductInput.data.name,
  });

  const store = await db.query.stores
    .findFirst({
      where: eq(stores.slug, storeSlug),
    })
    .execute();

  if (!store) {
    throw new Error("Store is not exist anymore, try again later.");
  }

  const { insertedId: productId } = await db
    .insert(products)
    .values({
      name: parsedNewProductInput.data.name,
      category: parsedNewProductInput.data.category,
      description: parsedNewProductInput.data.description,
      price: String(parsedNewProductInput.data.price),
      stock: Number(parsedNewProductInput.data.stock),
      slug: slugify(input.name),
      storeId: store.id,
      image: parsedNewProductInput.data.image,
    })
    .returning({
      insertedId: products.id,
    })
    .then((result) => ({
      ...result[0],
    }));

  if (!productId) {
    await delete_existing_images(input.image);
  }

  // Add new rating record
  await db.insert(ratings).values({
    productId: Number(productId),
  });

  revalidatePath("/");
}
