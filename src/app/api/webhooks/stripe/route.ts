// Webhook stripe

import Stripe from "stripe";
import * as dotenv from "dotenv";
import { stripe } from "@/lib/stripe";
import type { Readable } from "stream";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs";
import { OmitAndExtend } from "@/lib/utils";
import type {
  PaymentIntentMetadata,
  CheckoutSessionCompletedMetadata,
  CartItem,
} from "@/types";
import { db } from "@/db/core";
import { type Cart, addresses, carts, orders, products } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

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
    case "checkout.session.completed":
      // Payment is successful and the subscription is created.
      // You should provision the subscription and save the customer ID to your database.
      console.log(`🔔  Webhook received: ${event.type}`);

      const checkoutSessionObject = data.object as OmitAndExtend<
        Stripe.CheckoutSessionCompletedEvent.Data["object"],
        "metadata",
        CheckoutSessionCompletedMetadata
      >;

      await clerkClient.users.updateUserMetadata(
        checkoutSessionObject.metadata.clerkUserId,
        {
          privateMetadata: {
            stripeSubscriptionId: checkoutSessionObject.subscription,
          },
        },
      );
      break;
    case "payment_intent.succeeded":
      console.log(`🔔  Webhook received: ${event.type}`);

      // Handling anything after payment succeeded.

      const paymentIntentObject = data.object as OmitAndExtend<
        Stripe.PaymentIntentSucceededEvent.Data["object"],
        "metadata",
        PaymentIntentMetadata
      >;

      // Get corresponding cart
      const correspondingCart = (await db.query.carts.findFirst({
        where: eq(carts.id, Number(paymentIntentObject.metadata.cartId)),
      })) as Cart;

      const allItemsInCart = JSON.parse(
        correspondingCart.items as string,
      ) as CartItem[];

      // Parse cartItemId from checkout session and extract the id
      const parsedCartItemId = (
        JSON.parse(paymentIntentObject.metadata.checkoutItem) as CartItem[]
      ).map(({ id, qty }) => id) as number[];

      const anyItemsExcludingCheckoutItems = allItemsInCart.filter((item) => {
        if (!parsedCartItemId.includes(item.id)) {
          return item;
        }
      });

      // Remove all corresponding items from cart
      await db
        .update(carts)
        .set({
          items: anyItemsExcludingCheckoutItems.length
            ? JSON.stringify(anyItemsExcludingCheckoutItems)
            : JSON.stringify([]),
          isClosed: anyItemsExcludingCheckoutItems.length === 0 ? true : false,
        })
        .where(eq(carts.id, correspondingCart.id));

      // Shipping address works well with paymentintent.
      // It will occurs inside paymentintent object.
      const { city, country, line1, line2, postal_code, state } =
        paymentIntentObject.shipping?.address as Stripe.Address;

      const { insertId: addressId } = await db.insert(addresses).values({
        // @ts-expect-error
        city,
        country,
        line1,
        line2,
        postal_code,
        state,
      });

      // We get all corresponding items
      // Include anything from the items just to ensure it will persist even when the
      // owner has deleted the item.
      const parsedCartItems = JSON.parse(
        paymentIntentObject.metadata.checkoutItem,
      ) as CartItem[];

      const correspondingProducts = await db
        .select()
        .from(products)
        .where(inArray(products.id, parsedCartItemId))
        .execute()
        .then((products) => {
          return products.map((product) => {
            const qty = parsedCartItems.find(
              (parsedItem) => parsedItem.id === product.id,
            )?.qty;
            return {
              ...product,
              qty: qty ?? 0,
            };
          });
        });

      // TODO -> add userid so if the user has bought some product then the
      // corresponding user is eligible to give a comment/ comments (?)
      await db.insert(orders).values({
        // Weird error, no property called name
        // @ts-expect-error
        name: paymentIntentObject.shipping?.name,
        storeId: paymentIntentObject.metadata.storeId,
        stripePaymentIntentId: paymentIntentObject.id,
        stripePaymentIntentStatus: paymentIntentObject.status,
        email: paymentIntentObject.metadata.email,
        addressId,
        items: JSON.stringify(correspondingProducts),
      });

      break;
    default:
      console.log(`🔔  Webhook received: ${event.type}`);
  }
  return NextResponse.json({ received: true }, { status: 200 });
}
