"use client";

import { toast } from "sonner";
import { catchError } from "@/lib/utils";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Comment, NewComment } from "@/db/schema";
import { IconLoading } from "@/components/ui/icons";
import { AddNewCommentAction } from "@/actions/products/add-new-comment";
import { FormTextarea, Form, FormLabel, FormField } from "@/components/ui/form";
import { useUser } from "@clerk/nextjs";

interface CommentFormProps {
  commentStatus: "existing-comment" | "new-comment";
  orderId?: number;
  productId?: number;
  comment?: Comment;
}

export default function PurchaseItemCommentForm({
  commentStatus,
  comment,
  orderId,
  productId,
}: CommentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user, isLoaded } = useUser();
  const [commentData, setCommentData] = useState<NewComment>(
    comment ?? {
      rating: 3,
      content: "",
      orderId: orderId as number,
      productId: productId as number,
      userId: user?.id ?? "",
      fullname: `${user?.firstName} ${user?.lastName}`,
    },
  );

  if (!isLoaded) {
    return null;
  }

  async function submitCommentForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading((isLoading) => !isLoading);
    try {
      if (commentStatus === "new-comment") {
        await AddNewCommentAction({
          content: commentData.content,
          orderId: commentData.orderId,
          rating: commentData.rating,
          productId: commentData.productId,
          userId: commentData.userId,
          fullname: commentData.fullname,
        });
        toast.success(
          "Your comment has been successfully added to the product.",
        );
      }
      if (commentStatus === "existing-comment") {
      }
    } catch (error) {
      catchError(error);
    } finally {
      setIsLoading((isLoading) => !isLoading);
    }
  }

  return (
    <Form onSubmit={submitCommentForm} className="w-full rounded">
      <FormField>
        <FormLabel htmlFor="comment-input" className="text-gray-500">
          Feedback
        </FormLabel>
        <FormTextarea
          id="comment-input"
          name="comment"
          value={commentData.content}
          onChange={(event) =>
            setCommentData((commentData) => ({
              ...commentData,
              [event.target.name]: event.target.value,
            }))
          }
        />
      </FormField>
      <div className="mt-2 flex justify-end">
        <Button
          type="submit"
          disabled={isLoading}
          aria-disabled={isLoading ? "true" : "false"}
          className="inline-flex gap-1"
        >
          {isLoading && <IconLoading />}
          {commentStatus === "existing-comment"
            ? "Update Comment"
            : "Submit Comment"}
        </Button>
      </div>
    </Form>
  );
}
