"use client";

import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { Stripe, StripeElement } from "@stripe/stripe-js";
import { UserObjectCustomized } from "@/types";
import { Button } from "@/components/ui/button";
import { ChangeEvent, FormEvent, useState } from "react";
import { Form, FormInput, FormLabel } from "@/components/ui/form";
import {
  CardElement,
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";

export default function SubscriptionCheckoutForm() {
  const { user, isLoaded } = useUser();
  const [paymentIntent, setPaymentIntent] = useState();
  const [name, setName] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);

  // Initialize an instance of stripe
  const stripe = useStripe() as Stripe;
  const elements = useElements();

  if (!isLoaded) {
    return "";
  }

  if (!stripe || !elements) {
    // Disabled anything when Stripe.js has not loaded yet.
    return "";
  }

  async function handleSubmitSubscriptionCheckout(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    const clientSecret = (user as unknown as UserObjectCustomized)
      .publicMetadata.stripeSubscriptionClientSecret;

    const { error: submitError } = await elements!.submit();
    if (submitError) {
      toast.error(submitError.message);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      // @ts-expect-error
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/`,
      },
    });

    if (error) {
      toast.error(error.message);
    }
    setPaymentIntent(paymentIntent);
  }

  return (
    <Form onSubmit={handleSubmitSubscriptionCheckout}>
      <FormLabel>
        <FormInput
          type="text"
          value={name}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setName(e.target.value)
          }
        />
      </FormLabel>
      <PaymentElement />
      <Button disabled={!stripe || !elements}>Subscribe</Button>
    </Form>
  );
}
