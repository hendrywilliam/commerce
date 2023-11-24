"use server";

import { auth, useClerk, currentUser, clerkClient } from "@clerk/nextjs";
import type { UserObjectCustomized } from "@/types";
import { revalidatePath } from "next/cache";
import { db } from "@/db/core";
import { addresses } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function deleteExistingAddressAction(existingAddressId: number) {
  const { userId } = auth();
  const user = (await currentUser()) as unknown as UserObjectCustomized;

  if (!userId) {
    throw new Error("You must be signed in to select an address.");
  }

  const userPublicMetadata = user.publicMetadata;
  const userPrivateMetadata = user.privateMetadata;

  await clerkClient.users.updateUserMetadata(userId, {
    publicMetadata: {
      ...userPublicMetadata,
      address:
        userPublicMetadata.address === existingAddressId
          ? null
          : userPublicMetadata.address,
      // Add spread for upcoming properties later.
    },
    privateMetadata: {
      ...userPrivateMetadata,
      address: userPrivateMetadata.addresses.filter(
        (address) => address !== existingAddressId,
      ),
    },
  });

  await db.delete(addresses).where(eq(addresses.id, existingAddressId));

  revalidatePath("/");
}
