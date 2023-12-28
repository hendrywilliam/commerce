"use server";

import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { Store } from "@/db/schema";
import { stores } from "@/db/schema";
import { slugify } from "@/lib/utils";
import { TweakedOmit } from "@/lib/utils";
import { redirect } from "next/navigation";
import { storeValidation } from "@/lib/validations/stores";

export async function updateOwnedStoreAction(
  storeRawInput: TweakedOmit<Store, "createdAt" | "active" | "slug">,
) {
  try {
    const parseStoreRawInput = storeValidation.parse(storeRawInput);

    const isTheStoreExist = await db.query.stores.findFirst({
      where: (stores, { eq }) => eq(stores.id, storeRawInput.id),
    });

    if (!isTheStoreExist) {
      throw new Error("Invalid store. Please try again.");
    }

    await db
      .update(stores)
      .set({
        description: parseStoreRawInput.description,
        name: parseStoreRawInput.name,
        slug: slugify(parseStoreRawInput.name),
      })
      .where(eq(stores.id, storeRawInput.id));

    redirect("/dashboard/stores");
  } catch (error) {
    throw error;
  }
}
