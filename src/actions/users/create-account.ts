"use server";

import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { stripe } from "@/lib/stripe";
import { Payments, payments } from "@/db/schema";

export async function createAccountAction(storeId: Payments["storeId"]) {
  // Create a standard account
  const createdAccount = await stripe.accounts.create({
    type: "standard",
  });

  const paymentRecord = await db.query.payments.findFirst({
    where: eq(payments.stripeAccountId, createdAccount.id),
  });

  let stripeAccountId;

  if (paymentRecord && paymentRecord.stripeAccountId) {
    stripeAccountId = paymentRecord.stripeAccountId;
  } else {
    const { insertId } = await db.insert(payments).values({
      storeId: storeId,
      stripeAccountId: createdAccount.id,
    });

    const selectNewPaymentRecord = await db.query.payments.findFirst({
      where: eq(payments.id, Number(insertId)),
    });

    stripeAccountId = (selectNewPaymentRecord as Payments).stripeAccountId;
  }

  const accountLink = await stripe.accountLinks.create({
    account: stripeAccountId,
    type: "account_onboarding",
  });
}
