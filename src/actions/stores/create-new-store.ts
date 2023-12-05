"use server";

import { db } from "@/db/core";
import { stores } from "@/db/schema";
import { NewStore } from "@/db/schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs";
import { auth, clerkClient } from "@clerk/nextjs";
import { siteConfig } from "@/config/site-config";
import type { UserObjectCustomized } from "@/types";

export async function createNewStoreAction(storeData: NewStore) {
  const { userId } = auth();
  const user = (await currentUser()) as unknown as UserObjectCustomized;

  if (!userId) {
    throw new Error("You must be signed in to create a new store");
  }

  const isTheStoreExist = await db.query.stores.findFirst({
    where: (stores, { eq }) => eq(stores.name, storeData.name as string),
  });

  if (isTheStoreExist) {
    throw new Error("Store is already exist with that name.");
  }

  const findCurrentUserPlan = siteConfig.billingPlan.find((plan) => {
    return plan.title === user?.privateMetadata.plan ?? "Hobby";
  });

  const isAbleToCreateNewStore =
    findCurrentUserPlan &&
    (user?.privateMetadata.storeId as string[]).length <
      findCurrentUserPlan.limit;

  if (isAbleToCreateNewStore) {
    const { insertId } = await db.insert(stores).values({
      name: storeData.name,
      description: storeData.description,
    });

    const userDataPrivateMetadata = user?.privateMetadata;

    await clerkClient.users.updateUser(userId, {
      privateMetadata: {
        ...userDataPrivateMetadata,
        storeId: [...(userDataPrivateMetadata?.storeId as string[]), insertId],
      },
    });

    revalidatePath("/dashboard");
    redirect("/dashboard/stores");
  } else {
    throw new Error("New store creation limit reached");
  }
}
