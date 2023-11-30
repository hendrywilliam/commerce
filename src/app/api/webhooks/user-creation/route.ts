import { clerkClient } from "@clerk/nextjs";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const incomingRequest = (await req.json()) as WebhookEvent;

  const isUserCreationEvent =
    incomingRequest && incomingRequest.type === "user.created";

  const returnIdFromUserCreationEvent = incomingRequest.data.id;

  if (!returnIdFromUserCreationEvent)
    return NextResponse.json({ success: false }, { status: 400 });

  if (isUserCreationEvent && returnIdFromUserCreationEvent) {
    // Set default metadata for the new user.
    await clerkClient.users.updateUserMetadata(returnIdFromUserCreationEvent, {
      publicMetadata: {
        address: null,
      },
      privateMetadata: {
        plan: "Hobby",
        storeId: [],
        addresses: [],
        stripeCustomerId: "",
      },
    });
  }
  return NextResponse.json({ success: true }, { status: 200 });
}
