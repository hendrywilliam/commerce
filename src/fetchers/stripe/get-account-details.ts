"use server";

import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { Store, payments } from "@/db/schema";

export async function get_account_details_fetcher(storeId: Store["id"]) {
  const payment = await db.query.payments.findFirst({
    where: eq(payments.storeId, storeId),
  });

  if (!payment || !payment.stripeAccountId) {
    throw new Error(
      "The store is not available for a moment. Please try again later or try to contact the store to confirm your order.",
    );
  }

  const account = await stripe.accounts.retrieve(payment.stripeAccountId);
  return account as Stripe.Account;
}
