"use server";

import Stripe from "stripe";
import { notFound } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { StripeError } from "@stripe/stripe-js";

export async function get_payment_intent_fetcher(
  paymentIntentId: Stripe.PaymentIntent["id"],
) {
  if (!paymentIntentId) {
    notFound();
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    if ((error as StripeError).code === "resource_missing") {
      notFound();
    }
  }
}
