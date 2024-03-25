"use server";

import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs";
import { getAbsoluteUrl } from "@/lib/utils";
import { UserObjectCustomized } from "@/types";
import { manageSubscriptionValidation } from "@/lib/validations/user";
import { get_current_subscription_fetcher } from "@/fetchers/stripe/get-current-subscription";

// Price id coming from generated product on Stripe
export async function manageSubscriptionAction({
  subscriptionPriceId,
}: {
  subscriptionPriceId: string;
}) {
  const parsedSubscriptionPriceId =
    await manageSubscriptionValidation.spa(subscriptionPriceId);

  if (!parsedSubscriptionPriceId.success) {
    throw new Error(parsedSubscriptionPriceId.error.message);
  }

  const user = (await currentUser()) as unknown as UserObjectCustomized;

  if (!user) {
    throw new Error("You must be signed in to perform this action.");
  }

  const subscriptionUrl = getAbsoluteUrl("/dashboard/subscription");

  const { stripeCustomerId, stripeSubscriptionId } = user.privateMetadata;

  // When the user has not subscribed any plan (fresh user.) we redirect them to checkout session.
  if (!stripeSubscriptionId) {
    const session = await stripe.checkout.sessions.create({
      billing_address_collection: "auto",
      line_items: [
        {
          price: subscriptionPriceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: subscriptionUrl,
      cancel_url: subscriptionUrl,
      customer: stripeCustomerId,
      metadata: {
        clerkUserId: user.id,
      },
    });

    return session;
  }

  const { isActive, subscribedPlanEnd, subscribedPlanStart } =
    await get_current_subscription_fetcher(stripeSubscriptionId);

  if (isActive && !!subscribedPlanEnd && !!subscribedPlanStart) {
    // When the user has subscribed any plan, we redirect them to billing portal
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: subscriptionUrl,
    });

    return session;
  } else {
    // When the user has subscribed any plan but the plan is expired or canceled.
    const session = await stripe.checkout.sessions.create({
      billing_address_collection: "auto",
      line_items: [
        {
          price: subscriptionPriceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: subscriptionUrl,
      cancel_url: subscriptionUrl,
      customer: stripeCustomerId,
      metadata: {
        clerkUserId: user.id,
      },
    });

    return session;
  }
}
