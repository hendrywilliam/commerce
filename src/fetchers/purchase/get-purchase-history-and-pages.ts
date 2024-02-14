"use server";

import { db } from "@/db/core";
import { and, eq, sql } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs";
import { Orders, orders } from "@/db/schema";
import { redirect } from "next/navigation";

export async function get_purchase_history_fetcher({
  page,
  status,
  pageSize = 10,
}: {
  page: number;
  pageSize: number;
  status: Orders["stripePaymentIntentStatus"];
}) {
  const user = await currentUser();

  if (!user) {
    redirect("sign-in");
  }

  const orderHistory = await db
    .select()
    .from(orders)
    .where(
      and(
        eq(orders.stripePaymentIntentStatus, status!),
        eq(orders.userId, user.id),
      ),
    )
    .orderBy(orders.id)
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  const count = (
    await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(
        and(
          eq(orders.stripePaymentIntentStatus, status!),
          eq(orders.userId, user.id),
        ),
      )
      .limit(1)
  )[0].count;

  return {
    orderHistory,
    count: count > 0 ? Math.ceil(count / pageSize) : 1,
  };
}
