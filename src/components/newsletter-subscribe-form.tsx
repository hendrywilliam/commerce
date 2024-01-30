"use client";

import { toast } from "sonner";
import { useState } from "react";
import { catchError } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IconLoading } from "@/components/ui/icons";
import { Form, FormInput, FormField } from "@/components/ui/form";
import { subscribe_newsletter_action } from "@/actions/newsletter/subscribe-newsletter";

export default function NewsletterSubscribeForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function subscribeNewsletter() {
    setIsLoading((isLoading) => !isLoading);
    console.log(email);
    try {
      await subscribe_newsletter_action({ email });
      toast.success("Subscription successful! Thank you for joining us.");
    } catch (error) {
      catchError(error);
    } finally {
      setIsLoading((isLoading) => !isLoading);
      setEmail("");
    }
  }

  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault();
        subscribeNewsletter();
      }}
      className="flex flex-col space-y-2"
    >
      <FormField>
        <FormInput
          placeholder="example@gmail.com"
          onChange={(event) => setEmail(event.target.value)}
        />
      </FormField>
      <FormField>
        <Button
          disabled={isLoading}
          aria-disabled={isLoading ? "true" : "false"}
          type="submit"
          className="inline-flex gap-2"
        >
          {isLoading && <IconLoading />}
          Subscribe Newsletter
        </Button>
      </FormField>
    </Form>
  );
}
