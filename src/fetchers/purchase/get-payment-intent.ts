"use server";

import Stripe from "stripe";
import { notFound } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { StripeError } from "@stripe/stripe-js";
import { OmitAndExtend } from "@/lib/utils";
import { PaymentIntentMetadata } from "@/types";

export async function get_payment_intent_fetcher(
  paymentIntentId: Stripe.PaymentIntent["id"],
) {
  if (!paymentIntentId) {
    notFound();
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent as unknown as OmitAndExtend<
      Stripe.PaymentIntent,
      "metadata",
      PaymentIntentMetadata
    >;
  } catch (error) {
    //The ID provided is not valid. Either the resource does not exist, or an ID for a different resource has been provided.
    if ((error as StripeError).code === "resource_missing") {
      notFound();
    }
  }
}
