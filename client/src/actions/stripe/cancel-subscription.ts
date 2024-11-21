"use server";

import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";
import { UserObjectCustomized } from "@/types";
import "dotenv/config";

export async function cancelCurrentSubscriptionAction() {
    // Get subscription ID
    const user = (await currentUser()) as unknown as UserObjectCustomized;

    if (!user) {
        redirect("/sign-in");
    }

    const privateMetadata = user.privateMetadata;
    const subscriptionId = user.privateMetadata.stripeSubscriptionId;

    // Cancel subscription immediately
    await stripe.subscriptions.cancel(subscriptionId);

    // Delete subscription id
    await clerkClient.users.updateUser(user.id, {
        privateMetadata: {
            ...privateMetadata,
            /** Revert to FREE plan. */
            stripeSubscriptionId: process.env.HOBBY_PLAN_ID,
        } satisfies Partial<UserObjectCustomized["privateMetadata"]>,
    });

    revalidatePath("/");
}
