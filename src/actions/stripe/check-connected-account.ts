"use server";

import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";
import { payments, type Payments } from "@/db/schema";

export async function hasConnectedStripeAccount(storeId: Payments["storeId"]) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const payment = await db.query.payments.findFirst({
    where: eq(payments.storeId, storeId),
  });

  // Check if the user has finished onboarding process.
  return payment ? payment.detailsSubmitted : false;
}
