"use server";

import { revalidatePath } from "next/cache";
import type { UserObjectCustomized } from "@/types";
import { auth, clerkClient, currentUser } from "@clerk/nextjs";

export async function selectAddressAction(addressId: number) {
  const { userId } = auth();
  const user = (await currentUser()) as unknown as UserObjectCustomized;

  if (!userId) {
    throw new Error("You must be signed in to select an address.");
  }

  const userPublicMetadata = user.publicMetadata;

  await clerkClient.users.updateUser(userId, {
    publicMetadata: {
      ...userPublicMetadata,
      address: addressId,
    },
  });

  revalidatePath("/checkout");
}
