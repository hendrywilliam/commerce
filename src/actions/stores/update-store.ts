"use server";
import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { Store } from "@/db/schema";
import { stores } from "@/db/schema";
import { TweakedOmit } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { storeValidation } from "@/lib/validations/stores";

export async function updateOwnedStoreAction(
  storeRawInput: TweakedOmit<Store, "createdAt" | "active" | "slug">,
) {
  // Runtime validation
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
    })
    .where(eq(stores.id, storeRawInput.id));

  // Purge cache
  revalidatePath(`/dashboard/stores/${stores.id}`);
}
