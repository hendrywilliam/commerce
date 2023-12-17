"use server";

import { db } from "@/db/core";
import { auth } from "@clerk/nextjs";
import { slugify } from "@/lib/utils";
import { products } from "@/db/schema";
import { NewProduct } from "@/db/schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { TweakedOmit } from "@/lib/utils";
import { newProductValidation } from "@/lib/validations/product";

export async function addNewProductAction(
  input: TweakedOmit<NewProduct, "slug">,
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

  await db.insert(products).values({ ...input, slug: slugify(input.name) });
  revalidatePath("/");
}
