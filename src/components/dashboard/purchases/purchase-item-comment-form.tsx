"use client";

import { useState } from "react";
import { currentUser } from "@clerk/nextjs";
import { Comment, NewComment } from "@/db/schema";
import { FormTextarea, Form, FormLabel, FormField } from "@/components/ui/form";

interface CommentFormProps {
  commentStatus: "existing-comment" | "new-comment";
  orderId?: number;
  productId?: number;
  userId?: string;
  comment?: Partial<Comment>;
}

export default function PurchaseItemCommentForm({
  commentStatus = "new-comment",
  comment,
  orderId,
  productId,
  userId,
}: CommentFormProps) {
  const [commentData, setCommentData] = useState<Partial<NewComment>>(
    comment ?? {
      rating: 0,
      comment: "",
      orderId: orderId,
      productId: productId,
      userId: userId,
    },
  );

  return (
    <Form className="py-4 rounded w-full lg:w-1/2">
      <FormField>
        <FormLabel htmlFor="comment-input">Add new comment</FormLabel>
        <FormTextarea id="comment-input" />
      </FormField>
    </Form>
  );
}
