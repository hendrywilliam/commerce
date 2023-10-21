"use server";

import { NewStore } from "@/db/schema";
import { stores } from "@/db/schema";
import { db } from "@/db/core";
import { auth, clerkClient } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export async function createNewStoreAction(storeData: NewStore) {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId) {
    throw new Error("You must be signed in to create a new store");
  }

  const isTheStoreExist = await db.query.stores.findFirst({
    where: (stores, { eq }) => eq(stores.name, storeData.name as string),
  });

  if (isTheStoreExist) {
    throw new Error("Store is already exist with that name.");
  }

  const { insertId } = await db.insert(stores).values({
    name: storeData.name,
    active: storeData.active,
    description: storeData.description,
  });

  const userDataPrivateMetadata =
    (user?.privateMetadata.storeId as string[]) ?? [];

  await clerkClient.users.updateUser(userId, {
    privateMetadata: {
      storeId: [...userDataPrivateMetadata, insertId],
    },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard/stores");
}
