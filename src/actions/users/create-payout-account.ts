"use server";

import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { siteConfig } from "@/config/site-config";
import { environmentVariables } from "@/environments";
import { Payments, payments, stores } from "@/db/schema";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function createPayoutAccountAction(storeId: Payments["storeId"]) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("You must be signed in order to create a connect account.");
  }

  const storeData = await db.query.stores.findFirst({
    where: eq(stores.id, storeId),
  });

  if (!storeData) {
    throw new Error("Invalid store id. Please try again later.");
  }

  const currentUser = await clerkClient.users.getUser(userId);

  // We need to prefill some information in order to start accepting payment and receive payouts.
  // We can add in upfront, update it after successfully created the user or let the Stripe handle the verification.
  const createdAccount = await stripe.accounts.create({
    type: "custom",
    country: "US",
    email: currentUser.emailAddresses[0].emailAddress,
    capabilities: {
      card_payments: {
        requested: true,
      },
      transfers: {
        requested: true,
      },
    },
    business_type: "individual",
    business_profile: {
      // MCC stands for merchant category code -> classify each merchant by the type of goods and services they provide.
      mcc: "5311", // Department store.
      url: environmentVariables.baseURL,
    },
    // These are test data.
    company: {
      address: {
        city: "Gotham City",
        line1: "123 State St",
        postal_code: "12345",
        state: "NY",
      },
      tax_id: "000000000",
      name: storeData?.name,
      phone: "8888675309",
    },
    individual: {
      first_name: "Store",
      last_name: "Owner",
      ssn_last_4: "0000",
      dob: {
        day: 10,
        month: 11,
        year: 1980,
      },
      email: currentUser.emailAddresses[0].emailAddress,
      phone: "8888675309",
      address: {
        city: "Gotham City",
        line1: "123 State St",
        postal_code: "12345",
        state: "NY",
      },
    },
  });

  console.log(createdAccount);

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
    return_url: `${siteConfig.baseUrl}/dashboard/stores/${storeId}`,
    refresh_url: `${siteConfig.baseUrl}/dashboard/stores/${storeId}`,
  });

  revalidatePath(`/dashboard/stores/${storeId}`);
  redirect(accountLink.url);
}
