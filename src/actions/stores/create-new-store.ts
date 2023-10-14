"use server";

import { NewStore } from "@/db/schema";
import { stores } from "@/db/schema";
import { db } from "@/db/core";
import { auth, clerkClient } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs";

export async function createNewStore(storeData: NewStore) {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId) {
    throw new Error("You must be signed in to create a new store");
  }
  const { insertId } = await db.insert(stores).values({
    name: storeData.name,
    active: storeData.active,
    description: storeData.description,
  });

  const userDataPublicMetadata =
    (user?.publicMetadata.storeId as string[]) ?? [];

  await clerkClient.users.updateUser(userId, {
    publicMetadata: {
      storeId: [...userDataPublicMetadata, insertId],
    },
  });

  revalidatePath("/dashboard");
  return {
    error: false,
    message: "Store created",
    action: "Success, your store has been created.",
  };
}
