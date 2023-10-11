"use server";

import { CreateStore } from "@/db/schema";
import { stores } from "@/db/schema";
import { db } from "@/db/core";
import { auth, clerkClient } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

export async function createNewStore(storeData: CreateStore) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("You must be signed in to create a new store");
  }
  const { insertId: storeId } = await db.insert(stores).values({
    description: storeData.description,
    storeName: storeData.storeName,
  });

  await clerkClient.users.updateUser(userId, {
    publicMetadata: {
      storeId: storeId,
    },
  });
  revalidatePath("/dashboard");
  return {
    error: false,
    message: "Store created",
    action: "Succes, your store has been created.",
  };
}
