"use server";

import { db } from "@/db/core";
import "dotenv/config";
import { stores } from "@/db/schema";
import { getSubscriptionPlan, slugify } from "@/lib/utils";
import { NewStore } from "@/db/schema";
import { TweakedOmit } from "@/lib/utils";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";
import type { UserObjectCustomized } from "@/types";
import { newStoreValidation } from "@/lib/validations/stores";
import { checkStoreAvailabilityAction } from "./check-store-availability";

export async function createNewStoreAction(
  storeData: TweakedOmit<NewStore, "slug" | "createdAt">,
) {
  const user = (await currentUser()) as unknown as UserObjectCustomized;

  if (!user) throw new Error("You must be signed in to create a new store");

  const validateStoreData = await newStoreValidation.spa(storeData);

  if (!validateStoreData.success) {
    throw new Error(validateStoreData.error.message);
  }

  await checkStoreAvailabilityAction({ storeName: storeData.name });

  const privateMetadata = user.privateMetadata;
  const subscribedPlanId = privateMetadata.subscribedPlanId;

  const plan = getSubscriptionPlan(subscribedPlanId);

  const isAbleToCreateNewStore =
    plan && privateMetadata.storeId.length < plan.limit;

  if (isAbleToCreateNewStore) {
    const store = await db
      .insert(stores)
      .values({
        name: storeData.name,
        description: storeData.description,
        slug: slugify(storeData.name),
      })
      .returning({
        insertedId: stores.id,
        storeName: stores.name,
      })
      .then((result) => ({
        insertedId: result[0].insertedId,
        storeName: result[0].storeName,
      }));

    await clerkClient.users.updateUser(user.id, {
      privateMetadata: {
        ...privateMetadata,
        storeId: [...privateMetadata.storeId, store.insertedId],
      },
    });

    revalidatePath("/dashboard");
    redirect("/dashboard");
  } else {
    throw new Error(
      "New store creation limit reached. Please update your subscription plan.",
    );
  }
}
