"use server";

import { db } from "@/db/core";
import * as dotenv from "dotenv";
import { stores } from "@/db/schema";
import { slugify } from "@/lib/utils";
import { NewStore } from "@/db/schema";
import { TweakedOmit } from "@/lib/utils";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs";
import { auth, clerkClient } from "@clerk/nextjs";
import type { UserObjectCustomized } from "@/types";
import { subscriptionPlans } from "@/config/billing";
import { newStoreValidation } from "@/lib/validations/stores";
import { check_store_availability_action } from "./check-store-availability";
import { get_current_subscription_fetcher } from "@/fetchers/stripe/get-current-subscription";

dotenv.config();

export async function createNewStoreAction(
  storeData: TweakedOmit<NewStore, "slug" | "createdAt">,
) {
  const { userId } = auth();
  const user = (await currentUser()) as unknown as UserObjectCustomized;

  if (!userId) {
    throw new Error("You must be signed in to create a new store");
  }

  const validateStoreData = await newStoreValidation.spa(storeData);

  if (!validateStoreData.success) {
    throw new Error(validateStoreData.error.message);
  }

  await check_store_availability_action({ storeName: storeData.name });

  const userPrivateMetadata = user?.privateMetadata;
  let currentUserPlanId: string;

  if (userPrivateMetadata.stripeSubscriptionId) {
    // Retrieve current user subscribed plan
    const { subscribedPlanId } = await get_current_subscription_fetcher(
      userPrivateMetadata.stripeSubscriptionId,
    );
    currentUserPlanId = subscribedPlanId;
  } else {
    // Set default plan to hobby
    currentUserPlanId = process.env.HOBBY_PLAN_ID as string;
  }

  const findCurrentUserPlan = subscriptionPlans.find((plan) => {
    return plan.id === currentUserPlanId;
  });

  const isAbleToCreateNewStore =
    findCurrentUserPlan &&
    (user?.privateMetadata.storeId as string[]).length <
      findCurrentUserPlan.limit;

  if (isAbleToCreateNewStore) {
    const { insertId } = await db.insert(stores).values({
      name: storeData.name,
      description: storeData.description,
      slug: slugify(storeData.name),
    });

    await clerkClient.users.updateUser(userId, {
      privateMetadata: {
        ...userPrivateMetadata,
        storeId: [...(userPrivateMetadata?.storeId as string[]), insertId],
      },
    });

    revalidatePath("/dashboard");
    redirect("/dashboard/stores");
  } else {
    throw new Error(
      "New store creation limit reached. Please update your subscription plan.",
    );
  }
}
