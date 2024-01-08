"use server";

import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { clerkClient } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs";
import { UserObjectCustomized } from "@/types";

export async function cancelCurrentSubscriptionAction() {
  // Get subscription ID
  const user = (await currentUser()) as unknown as UserObjectCustomized;
  const privateMetadata = user.privateMetadata;
  const subscriptionId = user.privateMetadata.stripeSubscriptionId;

  if (!user) {
    redirect("/sign-in");
  }

  // Cancel subscription immediately
  await stripe.subscriptions.cancel(subscriptionId);

  // Delete subscription id
  await clerkClient.users.updateUser(user.id, {
    privateMetadata: {
      ...privateMetadata,
      stripeSubscriptionId: "",
    } satisfies Partial<UserObjectCustomized["privateMetadata"]>,
  });

  revalidatePath("/");
}
