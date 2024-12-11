"use server";

import { stripe } from "@/lib/stripe";
import { unixToDateString } from "@/lib/utils";

export async function get_current_subscription_fetcher(
  stripeSubscriptionId: string,
) {
  const subscriptionPlan =
    await stripe.subscriptions.retrieve(stripeSubscriptionId);

  const subscribedPlanEnd = subscriptionPlan.current_period_end;
  const subscribedPlanStart = subscriptionPlan.current_period_start;
  const subscribedPlanId = subscriptionPlan.items.data[0].plan.id;
  const isActive =
    subscriptionPlan.status === "active" &&
    !(new Date(subscribedPlanEnd * 1000).getTime() < new Date().getTime());

  const paymentMethod = await stripe.paymentMethods.retrieve(
    subscriptionPlan.default_payment_method as string,
  );

  return {
    subscribedPlanEnd: unixToDateString(subscribedPlanEnd),
    subscribedPlanStart: unixToDateString(subscribedPlanStart),
    subscribedPlanId,
    isActive,
    cardBrand: paymentMethod.card?.brand ?? "Unknown Brand",
    cardLastFour: paymentMethod.card?.last4,
  };
}
