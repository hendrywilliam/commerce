"use client";

import { Button } from "@/components/ui/button";
import { Form, FormInput, FormField } from "@/components/ui/form";

export default function NewsletterSubscribeForm() {
  return (
    <Form className="flex flex-col space-y-2">
      <FormField className="mt-4">
        <FormInput placeholder="Your email" />
      </FormField>
      <FormField>
        <Button type="submit">Subscribe Newsletter</Button>
      </FormField>
    </Form>
  );
}
