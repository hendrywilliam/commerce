"use server";

import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { Comment, Product, products, ratings } from "@/db/schema";

type UpdateRatingActionProps =
  | {
      action: "new" | "delete";
      productId: Product["id"];
      newRating: Comment["rating"];
      oldRating?: Comment["rating"];
    }
  | {
      action: "update";
      productId: Product["id"];
      newRating: Comment["rating"];
      oldRating: Comment["rating"];
    };

export async function update_product_rating_action(
  input: UpdateRatingActionProps,
) {
  const productRating = await db.query.ratings.findFirst({
    where: eq(ratings.productId, input.productId),
  });

  if (productRating) {
    let newAccumulatedRatings = productRating.accumulatedTotalRatings;
    let newTotalRatings = productRating.totalRatings;

    if (input.action === "new") {
      newAccumulatedRatings = newAccumulatedRatings + input.newRating;
      newTotalRatings = newTotalRatings + 1;
    }

    if (input.action === "update") {
      newAccumulatedRatings =
        newAccumulatedRatings - input.oldRating + input.newRating;
    }

    if (input.action === "delete") {
      newAccumulatedRatings = newTotalRatings - input.newRating;
      newTotalRatings = newTotalRatings - 1;
    }

    await db
      .update(ratings)
      .set({
        accumulatedTotalRatings: newAccumulatedRatings,
        totalRatings: newTotalRatings,
      })
      .where(eq(ratings.productId, input.productId));

    await db
      .update(products)
      .set({
        averageRatings: String(newAccumulatedRatings / newTotalRatings),
      })
      .where(eq(products.id, input.productId));
  } else {
    // If somehow the product's rating record is not exist.
    if (input.action === "new" || input.action === "update") {
      await db.insert(ratings).values({
        productId: input.productId,
        accumulatedTotalRatings: input.newRating,
        totalRatings: 1,
      });

      await db
        .update(products)
        .set({
          averageRatings: String(input.newRating / 1),
        })
        .where(eq(products.id, input.productId));
    } else {
      return;
    }
  }
  return;
}
