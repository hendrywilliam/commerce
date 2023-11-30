"use server";

import { stripe } from "@/lib/stripe";

// Register user to Stripe
export async function createCustomerStripeAction(customerEmail: string) {
  try {
    await stripe.customers.create({
      email: customerEmail,
    });
  } catch (error) {
    throw error;
  }
}
