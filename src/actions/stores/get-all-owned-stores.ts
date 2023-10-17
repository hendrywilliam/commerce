"use server";
import { db } from "@/db/core";
import { stores } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs";

export async function getAllOwnedStores() {
  let userStoresId =
    ((await currentUser())?.privateMetadata.storeId as string[]) ?? [];

  // return empty array if the user has no stores -> storeId (array) length is equal 0
  if (userStoresId.length === 0) {
    return [];
  } else {
    // string -> number
    const convertStoreIdsToNumber = userStoresId.map((item) => Number(item));
    return await db
      .select()
      .from(stores)
      .where(inArray(stores.id, convertStoreIdsToNumber));
  }
}
