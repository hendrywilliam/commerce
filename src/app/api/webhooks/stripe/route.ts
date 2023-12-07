// Webhook stripe

import Stripe from "stripe";
import * as dotenv from "dotenv";
import { stripe } from "@/lib/stripe";
import type { Readable } from "stream";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs";

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

    case "checkout.session.completed":
      // Payment is successful and the subscription is created.
      // You should provision the subscription and save the customer ID to your database.
      console.log(`🔔  Webhook received: ${event.type}`);
      const checkoutSessionObject = data.object as Omit<
        Stripe.CheckoutSessionCompletedEvent.Data["object"],
        "metadata"
      > & {
        metadata: {
          clerkUserId: string;
        };
      };

      await clerkClient.users.updateUserMetadata(
        checkoutSessionObject.metadata.clerkUserId,
        {
          privateMetadata: {
            stripeSubscriptionId: checkoutSessionObject.subscription,
          },
        },
      );

      break;

    default:
      console.log(`🔔  Webhook received: ${event.type}`);
  }
  return NextResponse.json({ received: true }, { status: 200 });
}
