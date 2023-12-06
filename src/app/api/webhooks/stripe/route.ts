// Webhook stripe

import Stripe from "stripe";
import { db } from "@/db/core";
import * as dotenv from "dotenv";
import { eq } from "drizzle-orm";
import { stripe } from "@/lib/stripe";
import type { Readable } from "stream";
import { headers } from "next/headers";
import { payments, stores } from "@/db/schema";
import { NextResponse } from "next/server";

dotenv.config();

async function getRawBody(readable: Readable): Promise<Buffer> {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export async function POST(req: Request) {
  let rawBody = await getRawBody(req.body as unknown as Readable);

  const head = headers();
  const stripeSignature = head.get("Stripe-Signature")!;
  const webhookSecret = process.env.STRIPE_WEBHOOKS_SECRET_KEY as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      stripeSignature,
      webhookSecret,
    );
  } catch (err) {
    console.log(err);
    console.log(`⚠️  Webhook signature verification failed.`);
    return NextResponse.json({ result: err }, { status: 400 });
  }

  // Extract data object from event
  const data: Stripe.Event.Data = event.data;

  // Handle various event sent from Stripe
  // @see https://stripe.com/docs/webhooks#events-overview
  switch (event.type) {
    case "customer.created":
      const { id: customerId } = data as Stripe.Customer;
      console.log(`🔔  Webhook received: ${event.type} ${customerId}`);

    case "account.updated":
      const { id: accountId, details_submitted } = data as Stripe.Account;

      const paymentRecord = await db.query.payments.findFirst({
        where: eq(payments.stripeAccountId, accountId),
      });

      // Update store record
      await db
        .update(stores)
        .set({
          active: true,
        })
        .where(eq(stores.id, paymentRecord!.storeId as number));

      // Update payment record
      await db
        .update(payments)
        .set({
          detailsSubmitted: details_submitted,
        })
        .where(eq(payments.id, paymentRecord!.id as number));

    default:
    //Unexpected event type
  }
  return NextResponse.json({ received: true }, { status: 200 });
}
