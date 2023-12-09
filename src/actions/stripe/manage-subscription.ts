"use server";

import { currentUser } from "@clerk/nextjs";
import { stripe } from "@/lib/stripe";
import { UserObjectCustomized } from "@/types";
import { getAbsoluteUrl } from "@/lib/utils";
import { getCurrentSubscriptionAction } from "@/actions/stripe/get-current-subscription";

// Price id coming from generated product on Stripe
export async function manageSubscriptionAction({
  subscriptionPriceId,
}: {
  subscriptionPriceId: string;
  stripeCustomerId: string;
}) {
  const user = await currentUser();

  if (!user) {
    throw new Error("You must be signed in to perform this action.");
  }

  const billingUrl = getAbsoluteUrl("/dashboard/billing");

  const { stripeCustomerId, stripeSubscriptionId } = (
    user as UserObjectCustomized
  ).privateMetadata;

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
      success_url: billingUrl,
      cancel_url: billingUrl,
      customer: stripeCustomerId,
      metadata: {
        clerkUserId: user.id,
      },
    });

    return session;
  }

  const { isActive, subscribedPlanEnd, subscribedPlanStart } =
    await getCurrentSubscriptionAction(stripeSubscriptionId);

  if (isActive && !!subscribedPlanEnd && !!subscribedPlanStart) {
    // When the user has subscribed any plan, we redirect them to billing portal
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: billingUrl,
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
      success_url: billingUrl,
      cancel_url: billingUrl,
      customer: stripeCustomerId,
      metadata: {
        clerkUserId: user.id,
      },
    });

    return session;
  }
}
