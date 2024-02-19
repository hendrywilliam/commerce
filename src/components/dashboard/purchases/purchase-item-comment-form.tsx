"use client";

import { FormTextarea, Form, FormLabel, FormField } from "@/components/ui/form";

export default function PurchaseItemCommentForm() {
  return (
    <Form>
      <FormField>
        <FormLabel htmlFor="comment-input">Add new comment</FormLabel>
        <FormTextarea className="w-full lg:w-1/2" id="comment-input" />
      </FormField>
    </Form>
  );
}
