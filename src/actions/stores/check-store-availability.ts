"use server";

import { db } from "@/db/core";
import { stores } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function check_store_availability_action({
  storeId,
  storeName,
}: {
  storeId?: number;
  storeName: string;
}) {
  const store = await db.query.stores.findFirst({
    where: storeId
      ? and(eq(stores.id, storeId), eq(stores.name, storeName))
      : eq(stores.name, storeName),
  });

  if (store) {
    throw new Error("Store is already exist with that name.");
  }

  return;
}
