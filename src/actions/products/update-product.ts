"use server";

import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import { type TweakedOmit, slugify } from "@/lib/utils";
import { products, type NewProduct, type Store } from "@/db/schema";
import { UploadData } from "@/types";

const utapi = new UTApi();

export async function update_product_action({
  input,
  storeId,
  imagesFileKey = [],
}: {
  input: TweakedOmit<NewProduct, "createdAt" | "slug">;
  storeId: Store["id"];
  imagesFileKey: UploadData["key"][];
}) {
  if (storeId) {
    throw new Error("Store ID is not valid. Please try again later.");
  }

  // Delete existing images
  if (!!imagesFileKey.length) {
    await utapi.deleteFiles(imagesFileKey);
  }

  const updateValue: TweakedOmit<NewProduct, "createdAt"> = {
    name: input.name,
    category: input.category,
    slug: slugify(input.name),
    description: input.description,
    image: JSON.stringify(input.image),
    // Decimal is a string, see: https://github.com/sidorares/node-mysql2/issues/795
    price:
      isNaN(Number(input.price)) || Number(input.price) < 0
        ? "0"
        : String(input.price),
    stock:
      isNaN(Number(input.stock)) || Number(input.stock) < 0 ? 0 : input.stock,
    rating: !!input.rating && input.rating > 0 ? input.rating : 0,
    storeId: storeId,
  };

  try {
    await db
      .update(products)
      .set(updateValue)
      .where(eq(products.id, input.id as number));
  } catch (error) {
    throw error;
  }
}
