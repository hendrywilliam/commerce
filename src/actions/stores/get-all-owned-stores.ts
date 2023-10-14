"use server";
import { db } from "@/db/core";
import { stores } from "@/db/schema";
import { inArray } from "drizzle-orm";

export async function getAllOwnedStores(storesId: string[]) {
  const convertStoreIdsToNumber = storesId.map((item) => Number(item));
  return await db
    .select()
    .from(stores)
    .where(inArray(stores.id, convertStoreIdsToNumber));
}
