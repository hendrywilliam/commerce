import type {
    PaymentIntentMetadata,
    CheckoutSessionCompletedMetadata,
    CartItem,
    CustomerObjectMetadata,
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
import { clerkClient } from "@clerk/nextjs/server";
import { OmitAndExtend } from "@/lib/utils";
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
            webhookSecret
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
        case "checkout.session.completed": {
            // Payment is successful and the subscription is created.
            // You should provision the subscription and save the customer ID to your database.
            console.log(`🔔  Webhook received: ${event.type}`);

            const checkoutSessionObject = data.object as OmitAndExtend<
                Stripe.CheckoutSessionCompletedEvent.Data["object"],
                "metadata",
                CheckoutSessionCompletedMetadata
            >;

            const subscriptionDetail = await stripe.subscriptions.retrieve(
                checkoutSessionObject.subscription as string
            );

            await clerkClient.users.updateUserMetadata(
                checkoutSessionObject.metadata.clerkUserId,
                {
                    privateMetadata: {
                        subscribedPlanId:
                            subscriptionDetail.items.data[0].plan.id,
                        stripeSubscriptionId:
                            checkoutSessionObject.subscription,
                    },
                }
            );
            break;
        }
        case "invoice.paid": {
            // Continue to provision the subscription as payment continue to be made.
            console.log(`🔔  Webhook received: ${event.type}`);

            const invoice =
                data.object as Stripe.InvoicePaidEvent.Data["object"];

            const customerId = String(invoice.customer);
            const customer = (await stripe.customers.retrieve(
                customerId
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
            const invoice =
                data.object as Stripe.InvoicePaidEvent.Data["object"];

            const customerId = String(invoice.customer);
            const customer = (await stripe.customers.retrieve(
                customerId
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
                where: eq(
                    carts.id,
                    Number(paymentIntentObject.metadata.cartId)
                ),
            })) as Cart;

            const allItemsInCart = correspondingCart.items ?? [];

            // Parse cartItemId from checkout session and extract the id
            const checkoutItemIds =
                allItemsInCart.length > 0
                    ? allItemsInCart.map((item) => item.id)
                    : [];

            const excludingCheckoutItems = allItemsInCart.filter((item) => {
                if (!checkoutItemIds.includes(item.id)) {
                    return item;
                }
            });

            // Remove all checkout-ed item in cart.
            await db
                .update(carts)
                .set({
                    items:
                        excludingCheckoutItems.length > 0
                            ? excludingCheckoutItems
                            : [],
                    isClosed: excludingCheckoutItems.length === 0,
                })
                .where(eq(carts.id, correspondingCart.id));

            // Add new shipping address
            const { city, country, line1, line2, postal_code, state } =
                paymentIntentObject.shipping?.address as Stripe.Address;

            const { insertId: addressId } = await db
                .insert(addresses)
                .values({
                    // @ts-expect-error
                    city,
                    country,
                    line1,
                    line2,
                    postal_code,
                    state,
                })
                .returning({
                    insertedId: addresses.id,
                })
                .then((result) => ({
                    insertId: result[0].insertedId,
                }));

            // Parsed checkout item with qty.

            const parsedCheckoutItems = JSON.parse(
                paymentIntentObject.metadata.checkoutItem
            ) as CartItem[];

            const orderedProducts = await db
                .select()
                .from(products)
                .where(inArray(products.id, checkoutItemIds))
                .execute()
                .then((products) => {
                    return products.map((product) => {
                        const qty = parsedCheckoutItems.find(
                            (parsedCheckoutItem) =>
                                parsedCheckoutItem.id === product.id
                        )?.qty;
                        return {
                            ...product,
                            qty: qty ?? 0,
                        };
                    });
                });

            const totalOrderAmount = orderedProducts.reduce(
                (total, item) => total + Number(item.price) * item.qty,
                0
            );

            await db.insert(orders).values({
                /** @ts-expect-error: Shipping address is nullable. */
                name: paymentIntentObject.shipping?.name,
                storeId: paymentIntentObject.metadata.storeId,
                userId: paymentIntentObject.metadata.userId,
                stripePaymentIntentId: paymentIntentObject.id,
                stripePaymentIntentStatus: paymentIntentObject.status,
                email: paymentIntentObject.metadata.email,
                addressId,
                total: String(totalOrderAmount),
                items: orderedProducts,
            });

            // Update product's stock.
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
                from: `Commerce Team <no-reply@${process.env
                    .MARKETING_DOMAIN!}>`,
                to: customerEmail,
                subject: "Thank you for your order!",
                react: OrderSuccessEmail({
                    orderItems: orderedProducts,
                    email: customerEmail,
                    orderId,
                }),
            });
            break;
        }
        default:
            console.log(`🔔  Webhook received: ${event.type}`);
    }
    return NextResponse.json(
        { received: true, action: "webhook" },
        { status: 200 }
    );
}
