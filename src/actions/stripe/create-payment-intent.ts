"use server";

import { stripe } from "@/lib/stripe";
import { cookies } from "next/headers";
import { currentUser } from "@clerk/nextjs";
import { CartLineDetailedItems } from "@/types";
import { cartDetailedItemsValidation } from "@/lib/validations/stores";

// Metadata cart id, store id, item id[]
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
    throw new Error("You have to login to perform this action.");
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

  console.log(priceAmount);

  const extractCartItemId = JSON.stringify(cartItem.map((item) => item.id));

  // Create payment intent.
  const paymentIntentCreated = await stripe.paymentIntents.create({
    amount: priceAmount,
    currency: "usd",
    // In latest version this properties is enabled by default, but i just love the express anything explicitly
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      storeId,
      cartItemId: extractCartItemId,
    },
  });

  return {
    paymentIntentId: paymentIntentCreated.id,
    clientSecret: paymentIntentCreated.client_secret,
  };
}
