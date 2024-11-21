"use server";

import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { UploadData } from "@/types";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { products, type NewProduct } from "@/db/schema";
import { type TweakedOmit, slugify, deleteImages } from "@/lib/utils";

export async function updateProductAction({
  input,
  imagesToDelete = [],
}: {
  input: TweakedOmit<NewProduct, "createdAt" | "slug">;
  imagesToDelete: UploadData[];
}) {
  if (imagesToDelete.length > 0) {
    await deleteImages(imagesToDelete);
  }

  const updateValue: TweakedOmit<NewProduct, "createdAt"> = {
    name: input.name,
    category: input.category,
    slug: slugify(input.name),
    description: input.description,
    image: input.image,
    price:
      isNaN(Number(input.price)) || Number(input.price) < 0
        ? "0"
        : String(input.price),
    stock:
      isNaN(Number(input.stock)) || Number(input.stock) < 0 ? 0 : input.stock,
  };

  await db
    .update(products)
    .set(updateValue)
    .where(eq(products.id, input.id as number));

  revalidatePath("/");
  revalidatePath("/dashboard/stores");
  redirect(`${slugify(input.name)}`);
}
