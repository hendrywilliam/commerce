"use server";

import { db } from "@/db/core";
import { revalidatePath } from "next/cache";
import { NewAddress, addresses } from "@/db/schema";
import type { UserObjectCustomized } from "@/types";
import { currentUser, auth, clerkClient } from "@clerk/nextjs";
import { newAddressValidation } from "@/lib/validations/address";

export async function addNewAddressAction(rawNewAddress: NewAddress) {
  // Doubling the layer of validation
  const parsedRawData =
    await newAddressValidation.safeParseAsync(rawNewAddress);

  if (!parsedRawData.success) {
    throw new Error(parsedRawData.error.message);
  }

  const { userId } = auth();
  const user = (await currentUser()) as unknown as UserObjectCustomized;

  if (!userId) {
    throw new Error("You must be signed in to be able to add a new address.");
  }

  const { insertId: addressId } = await db.insert(addresses).values({
    ...(parsedRawData.data as unknown as Exclude<
      NewAddress,
      "createdAt" | "id"
    >),
  });

  const userDataPrivateMetadata = user.privateMetadata;

  await clerkClient.users.updateUser(userId, {
    privateMetadata: {
      ...userDataPrivateMetadata,
      addresses: [
        ...(userDataPrivateMetadata?.addresses as number[]),
        addressId,
      ],
    },
  });

  revalidatePath("/");
}
