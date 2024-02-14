"use server";
import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Store, stores } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { UserObjectCustomized } from "@/types";
import { currentUser, clerkClient, auth } from "@clerk/nextjs";

export async function delete_owned_store_action(id: Store["id"]) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("You must be signed in to delete a new store");
  }

  const userData = (await currentUser()) as unknown as UserObjectCustomized;

  await db.delete(stores).where(eq(stores.id, id));

  const filterDeletedStore = userData.privateMetadata.storeId.filter(
    (item) => item !== String(id),
  );

  const userDataPrivateMetadata = userData.privateMetadata;

  await clerkClient.users.updateUser(userId, {
    privateMetadata: {
      ...userDataPrivateMetadata,
      storeId: [...filterDeletedStore],
    },
  });

  revalidatePath("/");
  redirect("/dashboard/stores");
}
