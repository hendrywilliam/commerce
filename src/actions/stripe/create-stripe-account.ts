"use server";

import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { stripe } from "@/lib/stripe";
import { payments, type Store } from "@/db/schema";

export async function createStripeAccountAction(storeId: Store["id"]) {
    const connectAccount = await stripe.accounts.create({
        type: "standard",
    });

    if (!connectAccount) {
        throw new Error("Account creation has failed. Please try again later.");
    }

    const payment = await db.query.payments.findFirst({
        where: eq(payments.storeId, storeId),
    });

    if (payment) {
        await db.update(payments).set({
            stripeAccountId: connectAccount.id,
        });
    } else {
        await db.insert(payments).values({
            storeId,
            stripeAccountId: connectAccount.id,
            detailsSubmitted: false,
        });
    }

    return {
        id: connectAccount.id,
    };
}
