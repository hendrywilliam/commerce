"use server";

import { stripe } from "@/lib/stripe";
import { BillingPlan, UserObjectCustomized } from "@/types";
import { auth, clerkClient } from "@clerk/nextjs";
import Stripe from "stripe";

// Price id coming from generated product on Stripe
export async function createCustomerSubscriptionAction(
  priceId: BillingPlan["plan"]["id"],
) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("You must be signed in to generate a subscription.");
  }
  const currentUser = (await clerkClient.users.getUser(
    userId,
  )) as unknown as UserObjectCustomized;
  const stripeCustomerId = currentUser.privateMetadata.stripeCustomerId;

  // Generate subscription
  const subscription = await stripe.subscriptions.create({
    customer: stripeCustomerId,
    items: [{ price: priceId }],
    payment_behavior: "default_incomplete",
    expand: ["latest_invoice.payment_intent"],
  });

  // Workaround for "client_secret" is not recognized
  const invoice = subscription.latest_invoice as Stripe.Invoice;
  const intent = invoice.payment_intent as Stripe.PaymentIntent;

  await clerkClient.users.updateUser(userId, {
    privateMetadata: {
      ...currentUser.privateMetadata,
      stripeSubscriptionId: subscription.id,
    } satisfies Partial<UserObjectCustomized["privateMetadata"]>,
  });

  return {
    clientSecret: intent.client_secret,
    subscriptionId: subscription.id,
  };
}
