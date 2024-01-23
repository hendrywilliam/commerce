"use server";

import { db } from "@/db/core";
import { stores } from "@/db/schema";
import { and, eq, not } from "drizzle-orm";

export async function check_store_availability_action({
  storeId,
  storeName,
}: {
  storeName: string;
  storeId?: number;
}) {
  const store = await db.query.stores.findFirst({
    where: storeId
      ? and(not(eq(stores.id, storeId)), eq(stores.name, storeName))
      : eq(stores.name, storeName),
  });

  if (store) {
    throw new Error("Store is already exist with that name.");
  }

  return;
}
