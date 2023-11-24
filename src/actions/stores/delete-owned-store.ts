"use server";
import { db } from "@/db/core";
import { stores } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { currentUser, clerkClient, auth } from "@clerk/nextjs";
import { UserObjectCustomized } from "@/types";

export async function deleteOwnedStore(id: number) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("You must be signed in to create a new store");
  }

  const userData = (await currentUser()) as unknown as UserObjectCustomized;

  await db.delete(stores).where(eq(stores.id, id));

  const storesIdWithoutDeletedOne = userData.privateMetadata.storeId.filter(
    (item) => item !== String(id),
  );

  const userDataPrivateMetadata = userData.privateMetadata;

  await clerkClient.users.updateUser(userId, {
    privateMetadata: {
      ...userDataPrivateMetadata,
      storeId: [...storesIdWithoutDeletedOne],
    },
  });

  revalidatePath("/");
  redirect("/dashboard/stores");
}
