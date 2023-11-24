"use server";

import { db } from "@/db/core";
import { inArray } from "drizzle-orm";
import { addresses } from "@/db/schema";
import { redirect } from "next/navigation";
import { currentUser, auth } from "@clerk/nextjs";
import type { UserObjectCustomized } from "@/types";

export async function getAddressDetailsAction() {
  const { userId } = auth();
  const user = (await currentUser()) as unknown as UserObjectCustomized;

  if (!userId) {
    redirect("/sign-in");
  }

  const userPrivateMetadata = user.privateMetadata;

  const userAddresses = userPrivateMetadata.addresses;

  const addressesDetails =
    userAddresses &&
    (await db
      .select()
      .from(addresses)
      .where(inArray(addresses.id, userAddresses)));

  return addressesDetails;
}
