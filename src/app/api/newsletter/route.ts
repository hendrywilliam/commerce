import { db } from "@/db/core";
import { newsletters } from "@/db/schema";

export async function POST() {
  const getNewsletterSubscriber = await db
    .select()
    .from(newsletters)
    .limit(10)
    .orderBy(newsletters.id);
}
