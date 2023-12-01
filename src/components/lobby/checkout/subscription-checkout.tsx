"use client";

import * as dotenv from "dotenv";
import { useUser } from "@clerk/nextjs";
import { UserObjectCustomized } from "@/types";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import SubscriptionCheckoutForm from "./subscription-checkout-form";

dotenv.config();

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHEABLE_KEY!;
const stripePromise = loadStripe(stripePublishableKey);

export function SubscriptionCheckout() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return null;
  }

  const clientSecret = (user as unknown as UserObjectCustomized).publicMetadata
    .stripeSubscriptionClientSecret;

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "night",
    },
  };

  return (
    <>
      <Elements options={options} stripe={stripePromise}>
        <SubscriptionCheckoutForm />
      </Elements>
    </>
  );
}
