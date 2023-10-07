import type { WebhookEvent } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const request = (await req.json()) as WebhookEvent;
}
