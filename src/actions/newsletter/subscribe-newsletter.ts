"use server";

import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";
import { newsletters, type Newsletter } from "@/db/schema";
import { subscribeNewsletterValidation } from "@/lib/validations/newsletter";

export async function subscribe_newsletter_action({
  email,
}: {
  email: Newsletter["email"];
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
    await db
      .update(newsletters)
      .set({
        status: "subscribed",
      })
      .where(eq(newsletters.id, isSubscriptionExist.id));
  } else {
    const { insertId: subscriptionId } = await db.insert(newsletters).values({
      email,
      status: "subscribed",
    });
    newsletterSubscriptionId = subscriptionId;

    if (!subscriptionId) {
      throw new Error("Unable to create a newsletter subscription");
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
