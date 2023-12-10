"use server";

import { stripe } from "@/lib/stripe";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";
import {
  CartLineDetailedItems,
  PaymentIntentSucceededMetadata,
  UserObjectCustomized,
} from "@/types";
import { cartDetailedItemsValidation } from "@/lib/validations/stores";
import { getPrimaryEmail } from "@/lib/utils";

export async function createPaymentIntentAction({
  storeId,
  cartItem,
}: {
  storeId: number;
  cartItem: CartLineDetailedItems[];
}) {
  const cartId = cookies().get("cart_id")?.value;
  const parsedCartItems = await cartDetailedItemsValidation.spa(cartItem);
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (!parsedCartItems.success) {
    throw new Error(parsedCartItems.error.message);
  }

  if (!storeId) {
    throw new Error("Invalid Store ID, Please try again later.");
  }

  if (isNaN(Number(cartId))) {
    throw new Error("Invalid Cart ID. Please try again later.");
  }

  // This amount is using the smallest currency unit, which is cents.
  // e.g real amount $600 -> stripe amount 600 * 100 -> 600 usd but in cents unit.
  const priceAmount = cartItem.reduce((total, item) => {
    return (total + Number(item.price) * item.qty) * 100;
  }, 0);

  // We include the id and qty only.
  const extractCartItem = JSON.stringify(
    cartItem.map((item) => {
      return {
        id: item.id,
        qty: item.qty,
      };
    }),
  );

  const userStripeCustomerId = (user as unknown as UserObjectCustomized)
    .privateMetadata.stripeCustomerId;

  // Create payment intent.
  const paymentIntentCreated = await stripe.paymentIntents.create({
    amount: priceAmount,
    customer: userStripeCustomerId,
    currency: "usd",
    // In latest version this properties is enabled by default, but i just love the express anything explicitly
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      storeId,
      cartId: cartId as string,
      // Due to limited capability of metadata to carry some data, we only embed the id and qty
      checkoutItem: extractCartItem,
      email: getPrimaryEmail(user),
    } satisfies PaymentIntentSucceededMetadata["metadata"],
  });

  return {
    paymentIntentId: paymentIntentCreated.id,
    clientSecret: paymentIntentCreated.client_secret,
  };
}
