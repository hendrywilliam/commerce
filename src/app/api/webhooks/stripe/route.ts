import type {
  PaymentIntentMetadata,
  CheckoutSessionCompletedMetadata,
  CartItem,
  CustomerObjectMetadata,
  CartLineDetailedItems,
} from "@/types";
import Stripe from "stripe";
import { db } from "@/db/core";
import * as dotenv from "dotenv";
import { stripe } from "@/lib/stripe";
import { resend } from "@/lib/resend";
import type { Readable } from "stream";
import { headers } from "next/headers";
import { eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs";
import {
  OmitAndExtend,
  calculateOrderAmounts,
  parse_to_json,
} from "@/lib/utils";
import { type Cart, addresses, carts, orders, products } from "@/db/schema";
import OrderSuccessEmail from "../../../../../react-email/emails/order-success-email";

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
    case "invoice.paid": {
      // Continue to provision the subscription as payment continue to be made.
      console.log(`🔔  Webhook received: ${event.type}`);

      const invoice = data.object as Stripe.InvoicePaidEvent.Data["object"];

      const customerId = String(invoice.customer);
      const customer = (await stripe.customers.retrieve(
        customerId,
      )) as unknown as CustomerObjectMetadata;
      const customerClerkId = customer.metadata.clerkId;

      // Renew subscription id for the user.
      await clerkClient.users.updateUserMetadata(customerClerkId, {
        privateMetadata: {
          stripeSubscriptionId: invoice.subscription,
        },
      });
      break;
    }
    case "invoice.payment_failed": {
      // The payment has failed due to invalid payment method.
      // This can be happen when the payment method has no funds, inactive or invalid card information (e.g cvv, expiry date).
      console.log(`🔔  Webhook received: ${event.type}`);
      const invoice = data.object as Stripe.InvoicePaidEvent.Data["object"];

      const customerId = String(invoice.customer);
      const customer = (await stripe.customers.retrieve(
        customerId,
      )) as unknown as CustomerObjectMetadata;
      const customerClerkId = customer.metadata.clerkId;

      await clerkClient.users.updateUserMetadata(customerClerkId, {
        privateMetadata: {
          stripeSubscriptionId: "",
        },
      });
      break;
    }
    case "payment_intent.succeeded": {
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

      const allItemsInCart = parse_to_json<CartItem[]>(
        correspondingCart.items as string,
      );

      // Parse cartItemId from checkout session and extract the id
      const parsedCheckoutItemsId = parse_to_json<CartItem[]>(
        paymentIntentObject.metadata.checkoutItem,
      ).map(({ id, qty }) => id) as number[];

      const anyItemsExcludingCheckoutItems = allItemsInCart.filter((item) => {
        if (!parsedCheckoutItemsId.includes(item.id)) {
          return item;
        }
      });

      // Remove all checkout items in cart.
      await db
        .update(carts)
        .set({
          items:
            anyItemsExcludingCheckoutItems.length > 0
              ? JSON.stringify(anyItemsExcludingCheckoutItems)
              : JSON.stringify([]),
          isClosed: anyItemsExcludingCheckoutItems.length === 0 ? true : false,
        })
        .where(eq(carts.id, correspondingCart.id));

      // Add new shipping address
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

      // Parsed checkout item with qty.
      const parsedCheckoutItems = parse_to_json<CartItem[]>(
        paymentIntentObject.metadata.checkoutItem,
      );

      const orderedProducts = await db
        .select()
        .from(products)
        .where(inArray(products.id, parsedCheckoutItemsId))
        .execute()
        .then((products) => {
          return products.map((product) => {
            const qty = parsedCheckoutItems.find(
              (parsedCheckoutItem) => parsedCheckoutItem.id === product.id,
            )?.qty;
            return {
              ...product,
              qty: qty ?? 0,
            };
          });
        });

      const { totalAmount: totalOrderAmount } =
        calculateOrderAmounts(orderedProducts);

      // todo add user id for comment (?)
      await db.insert(orders).values({
        // @ts-expect-error
        name: paymentIntentObject.shipping.name,
        storeId: paymentIntentObject.metadata.storeId,
        stripePaymentIntentId: paymentIntentObject.id,
        stripePaymentIntentStatus: paymentIntentObject.status,
        email: paymentIntentObject.metadata.email,
        addressId,
        total: totalOrderAmount,
        items: JSON.stringify(orderedProducts),
      });

      // Update product quantity.
      for await (const orderedProduct of orderedProducts) {
        await db
          .update(products)
          .set({
            stock:
              orderedProduct.stock > 0 &&
              orderedProduct.stock - orderedProduct.qty > 0
                ? orderedProduct.stock - orderedProduct.qty
                : 0,
          })
          .where(eq(products.id, orderedProduct.id));
      }

      // Gather all informations needed before pass it in email params.
      const customerEmail = paymentIntentObject.metadata.email;
      const orderId = paymentIntentObject.id;

      // Send order succeeded email.
      await resend.emails.send({
        from: process.env.MARKETING_EMAIL!,
        to: customerEmail,
        subject: "Thank you for your order!",
        react: OrderSuccessEmail({
          orderItems: orderedProducts,
          userEmail: customerEmail,
          orderId,
        }),
      });
      break;
    }
    default:
      console.log(`🔔  Webhook received: ${event.type}`);
  }
  return NextResponse.json({ received: true }, { status: 200 });
}
