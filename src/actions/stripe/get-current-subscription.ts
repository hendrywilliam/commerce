"use server";

import { stripe } from "@/lib/stripe";

export async function getSubscriptionPlanAction(stripeSubscriptionId: string) {
  if (!stripeSubscriptionId) {
    throw new Error("Invalid Subscription ID, Please try again later.");
  }

  const subscriptionPlan =
    await stripe.subscriptions.retrieve(stripeSubscriptionId);

  const subscribedPlanEnd = subscriptionPlan.current_period_end;
  const subscribedPlanStart = subscriptionPlan.current_period_start;
  const subscribedPlanId = subscriptionPlan.items.data[0].plan.id;

  return {
    subscribedPlanEnd,
    subscribedPlanStart,
    subscribedPlanId,
  };
}
