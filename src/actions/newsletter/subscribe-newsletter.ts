"use server";

import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";
import { newsletters, type Newsletters } from "@/db/schema";
import { subscribeNewsletterValidation } from "@/lib/validations/newsletter";

export async function subscribe_newsletter_action({
  email,
}: {
  email: Newsletters["email"];
}) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("You have to login before subscribe to a newsletter.");
  }

  const validation = await subscribeNewsletterValidation.spa({
    email,
  });

  if (!validation.success) {
    throw new Error(validation.error.issues[0].message);
  }

  const isSubscriptionExist = await db.query.newsletters.findFirst({
    where: eq(newsletters.email, validation.data.email),
  });

  let newsletterSubscriptionId;

  if (isSubscriptionExist) {
    throw new Error("Subscription is already exist.");
  } else {
    try {
      const { insertId: subscriptionId } = await db.insert(newsletters).values({
        email,
        status: "subscribed",
      });
      newsletterSubscriptionId = subscriptionId;
    } catch (error) {
      throw new Error("Failed to subscribe newsletter. Try again later.");
    }
  }

  const currentUserMetadata = (await clerkClient.users.getUser(userId))
    .privateMetadata;

  // Add newsletter subscription id to user data.
  await clerkClient.users.updateUser(userId, {
    privateMetadata: {
      ...currentUserMetadata,
      newsletterSubscriptionId: newsletterSubscriptionId,
    },
  });
}