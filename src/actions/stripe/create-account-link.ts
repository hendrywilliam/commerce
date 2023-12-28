"use server";

import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";
import { getAbsoluteUrl } from "@/lib/utils";
import { Store, payments, stores } from "@/db/schema";
import { createStripeAccountAction } from "./create-stripe-account";

export async function createAccountLinkAction(storeId: Store["id"]) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const account = await createStripeAccountAction(storeId);

  // Check whether user's payment record is exist.
  const paymentRecord = await db.query.payments.findFirst({
    where: eq(payments.stripeAccountId, account.id),
  });

  let stripeAccountId;

  if (paymentRecord && paymentRecord.stripeAccountId) {
    // Payment record exist then we assign the value to stripeAccountId.
    stripeAccountId = paymentRecord.stripeAccountId;
  } else {
    await db.insert(payments).values({
      storeId,
      stripeAccountId: account.id,
      detailsSubmitted: true,
    });
    // Assign stripeAccountId with createdAccount.id value.
    stripeAccountId = account.id;
  }

  // Get corresponding store.
  const correspondingStore = await db.query.stores.findFirst({
    where: eq(stores.id, storeId),
  });

  const storeSlug = correspondingStore?.slug;

  // Create an account link.
  const accountLink = await stripe.accountLinks.create({
    account: stripeAccountId,
    refresh_url: getAbsoluteUrl(`/dashboard/stores/${storeSlug}`),
    return_url: getAbsoluteUrl(`/dashboard/stores/${storeSlug}`),
    type: "account_onboarding",
  });

  redirect(accountLink.url);
}
