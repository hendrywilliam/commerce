"use client";

import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useUser } from "@clerk/nextjs";
import { UserObjectCustomized } from "@/types";
import { Button } from "@/components/ui/button";
import { FormEvent, useState, useEffect } from "react";
import { Form, FormField } from "@/components/ui/form";
import { LockIcon, IconLoading } from "@/components/ui/icons";
import {
  Stripe,
  StripeError,
  StripePaymentElementOptions,
} from "@stripe/stripe-js";
import { toast } from "sonner";

export default function SubscriptionCheckoutForm() {
  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize an instance of stripe
  const stripe = useStripe() as Stripe;
  const elements = useElements();

  if (!isLoaded) {
    return;
  }

  async function handleSubmitSubscriptionCheckout(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    // Disabled anything when Stripe.js/ Clerk has not loaded yet.
    if (!stripe || !elements) {
      return;
    }

    setIsLoading((isLoading) => !isLoading);
    const clientSecret = (user as unknown as UserObjectCustomized)
      .publicMetadata.stripeSubscriptionClientSecret;
    try {
      const { error: submitError } = await elements!.submit();

      if (submitError) {
        throw submitError;
      }

      const { error: confirmPaymentError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          // Replace with completion page.
          return_url: `${window.location.origin}/`,
        },
      });

      if (confirmPaymentError) {
        throw confirmPaymentError;
      }
    } catch (error) {
      toast.error((error as StripeError).message);
    } finally {
      setIsLoading((isLoading) => !isLoading);
    }
  }

  const paymentElementsOption: StripePaymentElementOptions = {
    layout: "tabs",
  };

  return (
    <Form onSubmit={handleSubmitSubscriptionCheckout}>
      <PaymentElement options={paymentElementsOption} />
      <FormField className="mt-4">
        <Button
          className="inline-flex gap-2"
          disabled={!stripe || !elements || isLoading || !isLoaded}
        >
          Subscribe {isLoading ? <IconLoading /> : <LockIcon />}
        </Button>
      </FormField>
    </Form>
  );
}
