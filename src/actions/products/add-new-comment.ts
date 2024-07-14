"use server";

import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { NewComment, comments, products } from "@/db/schema";
import { productCommentValidation } from "@/lib/validations/product";
import { update_product_rating_action } from "@/actions/products/update-product-rating";

export async function AddNewCommentAction(input: NewComment) {
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    const parsedInput = await productCommentValidation.spa(input);

    if (!parsedInput.success) {
        throw new Error(parsedInput.error.issues[0].message);
    }

    const { content, orderId, productId, rating, userId, fullname } =
        parsedInput.data;

    // Check if somehow the product is deleted.
    const isProductExist = await db.query.products.findFirst({
        where: eq(products.id, productId),
    });

    if (!isProductExist) {
        throw new Error(
            "Product is not exist anymore. Please try again later or contact the store."
        );
    }

    const newComment = await db.insert(comments).values({
        content,
        orderId,
        productId,
        rating,
        userId,
        fullname,
    });

    if (!newComment) {
        throw new Error(
            "Failed to create a new comment. Please try again later."
        );
    }

    await update_product_rating_action({
        action: "new",
        newRating: rating,
        productId,
    });

    return;
}
