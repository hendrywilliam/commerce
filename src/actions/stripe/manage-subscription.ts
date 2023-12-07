"use server";

import Stripe from "stripe";
import { currentUser } from "@clerk/nextjs";
import { stripe } from "@/lib/stripe";
import { BillingPlan } from "@/types";
import { getAbsoluteUrl } from "@/lib/utils";

// Price id coming from generated product on Stripe
export async function manageSubscriptionAction({
  subscriptionPriceId,
  stripeCustomerId,
}: {
  subscriptionPriceId: string;
  stripeCustomerId: string;
}) {
  const user = await currentUser();

  if (!user) {
    throw new Error("You must be signed in to perform this action.");
  }

  const billingUrl = getAbsoluteUrl("/dashboard/billing");

  // When the user has not subscribed any plan, we create checkout session.
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
  });

  return session;
}
