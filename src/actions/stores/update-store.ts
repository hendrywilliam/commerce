"use server";

import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { Store } from "@/db/schema";
import { stores } from "@/db/schema";
import { slugify } from "@/lib/utils";
import { TweakedOmit } from "@/lib/utils";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { storeValidation } from "@/lib/validations/stores";
import { check_store_availability_action } from "./check-store-availability";

export async function updateOwnedStoreAction(
  storeRawInput: TweakedOmit<Store, "createdAt" | "active" | "slug">,
) {
  const parseStoreRawInput = await storeValidation.spa(storeRawInput);

  if (!parseStoreRawInput.success) {
    throw new Error(parseStoreRawInput.error.issues[0].message);
  }

  await check_store_availability_action({
    storeName: parseStoreRawInput.data.name,
    storeId: storeRawInput.id,
  });

  await db
    .update(stores)
    .set({
      description: parseStoreRawInput.data.description,
      name: parseStoreRawInput.data.name,
      slug: slugify(parseStoreRawInput.data.name),
    })
    .where(eq(stores.id, storeRawInput.id));

  revalidatePath("/dashboard/stores");
  redirect("/dashboard/stores");
}
