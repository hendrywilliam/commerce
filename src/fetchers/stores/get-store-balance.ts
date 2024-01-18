"use server";

import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { stripe } from "@/lib/stripe";
import { type Store, payments } from "@/db/schema";

export async function get_store_balance_fetcher(storeId: Store["id"]) {
  // Get payment record
  const storePayment = await db.query.payments.findFirst({
    where: eq(payments.storeId, storeId),
  });

  // Available balance meaning the funds can be paid out now.
  let availableBalance;
  // Pending balance meaning the funds are not yet available to pay out.
  let pendingBalance;

  if (storePayment) {
    const allBalance = await stripe.balance.retrieve({
      stripeAccount: storePayment.stripeAccountId,
    });

    availableBalance = allBalance.available.reduce(
      (total, availableBalance) => total + availableBalance.amount,
      0,
    );

    pendingBalance = allBalance.pending.reduce(
      (total, pendingBalance) => total + pendingBalance.amount,
      0,
    );
  } else {
    // Set default to 0
    availableBalance = 0;
    pendingBalance = 0;
  }

  return {
    availableBalance,
    pendingBalance,
  };
}
