"use server";

import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { Store } from "@/db/schema";
import { stores } from "@/db/schema";
import { slugify } from "@/lib/utils";
import { TweakedOmit } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { storeValidation } from "@/lib/validations/stores";
import { check_store_availability_action } from "./check-store-availability";

export async function updateOwnedStoreAction(
  storeRawInput: TweakedOmit<Store, "createdAt" | "active" | "slug">,
) {
  try {
    const parseStoreRawInput = storeValidation.parse(storeRawInput);

    await check_store_availability_action({
      storeName: parseStoreRawInput.name,
      storeId: storeRawInput.id,
    });

    await db
      .update(stores)
      .set({
        description: parseStoreRawInput.description,
        name: parseStoreRawInput.name,
        slug: slugify(parseStoreRawInput.name),
      })
      .where(eq(stores.id, storeRawInput.id));

    revalidatePath("/dashboard/stores");
  } catch (error) {
    throw error;
  }
}
