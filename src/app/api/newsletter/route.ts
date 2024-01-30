import { db } from "@/db/core";
import { resend } from "@/lib/resend";
import { baseUrl } from "@/config/site";
import { asc, desc, eq, sql } from "drizzle-orm";
import { newsletters, products } from "@/db/schema";
import { NextResponse } from "next/server";
import NewsletterEmail from "../../../../react-email/emails/newsletter-email";

// Scheduled task, firing every 5 minutes past hour.
export async function POST() {
  // Get 5 new arrival products & total newsletter subscription
  const [newArrivalProducts, totalNewsletterSubs] = await Promise.all([
    await db
      .select()
      .from(products)
      .orderBy(desc(products.createdAt), asc(products.id))
      .limit(5),
    await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(newsletters)
      .limit(1)
      .execute()
      .then((result) => result[0].count),
  ]);

  const limit = 20;
  let randomOffset = 0;
  if (totalNewsletterSubs > limit) {
    randomOffset = Math.floor(Math.random() * (totalNewsletterSubs - limit));
  }

  // Get random records
  const newsletterSubscribers = await db
    .select()
    .from(newsletters)
    .where(eq(newsletters.status, "subscribed"))
    .offset(randomOffset)
    .limit(limit);

  for await (const subscriber of newsletterSubscribers) {
    await resend.emails.send({
      from: process.env.MARKETING_EMAIL!,
      to: subscriber.email,
      subject: "Weekly newsletter!",
      react: NewsletterEmail({
        email: subscriber.email,
        baseUrl: baseUrl as string,
        products: newArrivalProducts ?? [],
      }),
    });
  }

  return NextResponse.json(
    { received: true, action: "scheduled-task" },
    { status: 200 },
  );
}
