"use client";

import {
  Stripe,
  StripeError,
  StripePaymentElementOptions,
} from "@stripe/stripe-js";
import { toast } from "sonner";
import {
  useStripe,
  useElements,
  AddressElement,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useUser } from "@clerk/nextjs";
import { FormEvent, useState } from "react";
import { getAbsoluteUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { LockIcon, IconLoading } from "@/components/ui/icons";

interface CheckoutForm {
  clientSecret: string;
}

export default function CheckoutForm({ clientSecret }: CheckoutForm) {
  const { isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize an instance of stripe
  const stripe = useStripe() as Stripe;
  const elements = useElements();

  if (!isLoaded) {
    return;
  }

  async function handleCheckoutPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Disabled anything when Stripe.js/ Clerk has not loaded yet.
    if (!stripe || !elements) {
      return;
    }

    setIsLoading((isLoading) => !isLoading);
    try {
      const { error: submitError } = await elements!.submit();

      if (submitError) {
        throw submitError;
      }

      const { error: confirmPaymentError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: getAbsoluteUrl("/checkout/order-status"),
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
    <Form onSubmit={handleCheckoutPayment}>
      <AddressElement options={{ mode: "shipping" }} />
      <PaymentElement options={paymentElementsOption} className="mt-3" />
      <FormField className="mt-4">
        {elements && (
          <Button
            className="inline-flex gap-2"
            disabled={!stripe || !elements || isLoading || !isLoaded}
          >
            Confirm Payment {isLoading ? <IconLoading /> : <LockIcon />}
          </Button>
        )}
      </FormField>
    </Form>
  );
}
