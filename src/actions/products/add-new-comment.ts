"use server";

import { db } from "@/db/core";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";
import { NewComment, comments } from "@/db/schema";
import { productCommentValidation } from "@/lib/validations/product";

export async function add_new_comment_action(input: NewComment) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const parsedInput = await productCommentValidation.spa(input);

  if (!parsedInput.success) {
    throw new Error(parsedInput.error.issues[0].message);
  }

  const { comment, orderId, productId, rating, userId } = parsedInput.data;
  const newComment = await db.insert(comments).values({
    comment,
    orderId,
    productId,
    rating,
    userId,
  });

  if (!newComment) {
    throw new Error("Failed to create a new comment. Please try again later.");
  }

  return;
}
