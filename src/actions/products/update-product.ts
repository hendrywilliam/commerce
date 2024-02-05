"use server";

import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { UploadData } from "@/types";
import { redirect } from "next/navigation";
import { products, type NewProduct } from "@/db/schema";
import { type TweakedOmit, slugify, delete_existing_images } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function update_product_action({
  input,
  imagesToDelete = [],
}: {
  input: TweakedOmit<NewProduct, "createdAt" | "slug">;
  imagesToDelete: UploadData[];
}) {
  if (!!imagesToDelete.length) {
    await delete_existing_images(imagesToDelete);
  }

  const updateValue: TweakedOmit<NewProduct, "createdAt"> = {
    name: input.name,
    category: input.category,
    slug: slugify(input.name),
    description: input.description,
    image: JSON.stringify(input.image),
    price:
      isNaN(Number(input.price)) || Number(input.price) < 0
        ? "0"
        : String(input.price),
    stock:
      isNaN(Number(input.stock)) || Number(input.stock) < 0 ? 0 : input.stock,
    rating: !!input.rating && input.rating > 0 ? input.rating : 0,
  };

  await db
    .update(products)
    .set(updateValue)
    .where(eq(products.id, input.id as number));

  revalidatePath("/dashboard/stores");
  redirect(`${slugify(input.name)}`);
}
