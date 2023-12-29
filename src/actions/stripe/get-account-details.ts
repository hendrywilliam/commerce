"use server";

import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { Store, payments } from "@/db/schema";

export async function getAccountDetailsAction(storeId: Store["id"]) {
  const payment = await db.query.payments.findFirst({
    where: eq(payments.storeId, storeId),
  });

  if (!payment || !payment.stripeAccountId) {
    throw new Error(
      "This store is not available for a moment. Please try again later.",
    );
  }

  const account = await stripe.accounts.retrieve(payment.stripeAccountId);
  return account as Stripe.Account;
}
