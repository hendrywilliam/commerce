"use server";

import {
  CartLineDetailedItems,
  PaymentIntentMetadata,
  UserObjectCustomized,
} from "@/types";
import { stripe } from "@/lib/stripe";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";
import { getPrimaryEmail } from "@/lib/utils";
import { calculateOrderAmounts } from "@/lib/utils";
import { cartDetailedItemsValidation } from "@/lib/validations/stores";
import { get_account_details_fetcher } from "@/fetchers/stripe/get-account-details";

export async function createPaymentIntentAction({
  storeId,
  cartItem,
}: {
  storeId: number;
  cartItem: CartLineDetailedItems[];
}) {
  const cartId = cookies().get("cart_id")?.value;

  if (isNaN(Number(cartId))) {
    throw new Error("Invalid Cart ID. Please try again later.");
  }

  if (!storeId) {
    throw new Error("Invalid Store ID, Please try again later.");
  }

  const parsedCartItems = await cartDetailedItemsValidation.spa(cartItem);

  if (!parsedCartItems.success) {
    throw new Error(parsedCartItems.error.message);
  }

  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const accountDetails = await get_account_details_fetcher(storeId);

  const { totalAmount, feeAmount } = calculateOrderAmounts(cartItem);

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

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount,
    customer: userStripeCustomerId,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
    application_fee_amount: feeAmount,
    metadata: {
      storeId,
      cartId: cartId as string,
      checkoutItem: extractCartItem,
      email: getPrimaryEmail(user),
    } satisfies PaymentIntentMetadata["metadata"],
    transfer_data: {
      destination: accountDetails.id,
    },
  });

  return {
    paymentIntentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret,
  };
}
