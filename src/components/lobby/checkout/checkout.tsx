"use client";

import * as dotenv from "dotenv";
import { useUser } from "@clerk/nextjs";
import { UserObjectCustomized } from "@/types";
import { Elements } from "@stripe/react-stripe-js";
import SubscriptionCheckoutForm from "./checkout-form";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";

dotenv.config();

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHEABLE_KEY!;
const stripePromise = loadStripe(stripePublishableKey);

interface CheckoutProps {
  clientSecret: string;
}

export function Checkout({ clientSecret }: CheckoutProps) {
  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
    },
  };

  return (
    <>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <SubscriptionCheckoutForm clientSecret={clientSecret} />
        </Elements>
      )}
    </>
  );
}
