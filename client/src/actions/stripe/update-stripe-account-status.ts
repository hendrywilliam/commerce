"use server";

import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { stripe } from "@/lib/stripe";
import { payments, stores, type Store } from "@/db/schema";

export async function updateStripeAccountStatusAction(storeId: Store["id"]) {
  // An user that is redirected to return_url might have not completed the onboarding process.
  // We check and update the payment record each time the checkout session created.
  try {
    // Retrieve payment record
    const paymentRecord = await db.query.payments.findFirst({
      where: eq(payments.storeId, storeId),
    });

    if (!paymentRecord) {
      return;
    }

    const stripeAccountId = paymentRecord.stripeAccountId;

    // Retrieve the store Account
    const { charges_enabled, details_submitted } =
      await stripe.accounts.retrieve(stripeAccountId);

    if (charges_enabled && details_submitted) {
      // Update the corresponding Payment record.
      await db
        .update(payments)
        .set({
          detailsSubmitted: details_submitted,
        })
        .where(eq(payments.storeId, storeId));

      // Update the store status
      await db
        .update(stores)
        .set({
          active: true,
        })
        .where(eq(stores.id, storeId));

      return;
    }

    return;
  } catch (error) {
    return;
  }
}
