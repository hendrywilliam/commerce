"use server";

import { Store, stores } from "@/db/schema";
import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function setStoreStatusAction({
  store_id,
}: {
  store_id: Store["id"];
}) {
  const store = await db.query.stores.findFirst({
    where: eq(stores.id, store_id),
  });

  if (!store) {
    throw new Error("Invalid store. Please try again.");
  }

  await db
    .update(stores)
    .set({
      active: !store.active,
    })
    .where(eq(stores.id, store_id));

  revalidatePath(`/dashboard/stores/${store.slug}`);
}
