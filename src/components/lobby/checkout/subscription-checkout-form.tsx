"use client";

import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { Stripe } from "@stripe/stripe-js";
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
  const [name, setName] = useState("Jenny Rosen");
  const [isDisabled, setIsDisabled] = useState(true);

  // Initialize an instance of stripe
  const stripe = useStripe() as Stripe;
  const elements = useElements();

  if (!isLoaded) {
    return null;
  }

  if (!stripe || !elements) {
    // Disabled anything when Stripe.js has not loaded yet.
    return "";
  }

  async function handleSubmitSubscriptionCheckout(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    const cardElement = elements?.getElement(CardElement);
    const clientSecret = (user as unknown as UserObjectCustomized)
      .publicMetadata.stripeSubscriptionClientSecret;

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          // @ts-expect-error
          card: cardElement,
          billing_details: {
            name: name,
          },
        },
      },
    );

    if (error) {
      toast.error(error.message);
    }
    // @ts-expect-error
    setPaymentIntent(paymentIntent);
  }

  const paymentElementOptions = {
    layout: "tabs",
  };

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
      <CardElement />
      <Button>Subscribe</Button>
    </Form>
  );
}
