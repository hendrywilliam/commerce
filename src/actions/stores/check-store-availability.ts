"use server";

import { db } from "@/db/core";
import { stores, Store } from "@/db/schema";
import { and, eq, not } from "drizzle-orm";

export async function checkStoreAvailabilityAction({
  storeId,
  storeName,
}: {
  storeName: Store["name"];
  storeId?: Store["id"];
}) {
  const store = await db.query.stores.findFirst({
    where: storeId
      ? and(not(eq(stores.id, storeId)), eq(stores.name, storeName))
      : eq(stores.name, storeName),
  });

  if (store) throw new Error("Store is already exist with that name.");

  return;
}
