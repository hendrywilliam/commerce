"use server";

import { db } from "@/db/core";
import { Order, comments, orders } from "@/db/schema";
import { ProductWithQuantity } from "@/types";
import { currentUser } from "@clerk/nextjs";
import { and, eq, inArray } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";

export async function getSpecificPurchaseDetails(purchaseId: Order["id"]) {
  const user = await currentUser();

  if (!user) {
    redirect("/dashboard/stores");
  }

  if (isNaN(purchaseId)) {
    notFound();
  }

  const purchase = await db.query.orders.findFirst({
    where: and(eq(orders.id, purchaseId), eq(orders.userId, user.id)),
  });

  if (!purchase) {
    notFound();
  }

  const purchaseItems = purchase.items ?? [];

  const allComments =
    purchaseItems.length > 0
      ? await db
          .select()
          .from(comments)
          .where(
            and(
              eq(comments.orderId, purchase.id),
              inArray(comments.productId, [
                ...purchaseItems.map((purchaseItem) => purchaseItem.id),
              ]),
            ),
          )
      : [];

  const itemsWithComments =
    purchaseItems.length > 0
      ? purchaseItems.map((purchaseItem) => ({
          ...purchaseItem,
          comment:
            allComments && allComments.length > 0
              ? allComments.find(
                  (comment) => comment.productId === purchaseItem.id,
                )
              : undefined,
        }))
      : [];

  return {
    itemsWithComments,
    purchase,
  };
}
