"use client";

import * as dotenv from "dotenv";
import { useUser } from "@clerk/nextjs";
import { UserObjectCustomized } from "@/types";
import { siteConfig } from "@/config/site-config";
import { Elements } from "@stripe/react-stripe-js";
import SubscriptionCheckoutForm from "./subscription-checkout-form";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";

dotenv.config();

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHEABLE_KEY!;
const stripePromise = loadStripe(stripePublishableKey);

export function SubscriptionCheckout() {
  const { user, isLoaded } = useUser();

  // Make sure the Clerk client is loaded.
  if (!isLoaded) {
    return;
  }

  const userObject = user as unknown as UserObjectCustomized;
  const clientSecret = userObject.publicMetadata.stripeSubscriptionClientSecret;
  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
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
