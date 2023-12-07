"use server";

import { z } from "zod";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { clerkClient } from "@clerk/nextjs";
import { getPrimaryEmail } from "@/lib/utils";
import { registerValidation } from "@/lib/validations/user";
import { UserObjectCustomized } from "@/types";

type CreateUser = z.infer<typeof registerValidation>;

// This will create clerk user and stripe customer
export async function createStripeCustomerAction(rawUserData: CreateUser) {
  const parsedRawData = await registerValidation.safeParseAsync(rawUserData);

  if (!parsedRawData.success) {
    throw new Error(parsedRawData.error.message);
  }

  // Create user with some default properties.
  const userCreated = await clerkClient.users.createUser({
    emailAddress: [parsedRawData.data.email],
    password: parsedRawData.data.password,
    publicMetadata: {
      address: "",
    },
    privateMetadata: {
      plan: "Hobby",
      storeId: [],
      addresses: [],
    },
  });

  if (!userCreated) {
    throw new Error("Unable to create an user for now. Try again later.");
  }

  const email = getPrimaryEmail(userCreated);

  // Register user to Stripe.
  const stripeCustomer: Stripe.Customer = await stripe.customers.create({
    email,
  });

  const userPrivateMetadata = userCreated.privateMetadata;

  await clerkClient.users.updateUser(userCreated.id, {
    privateMetadata: {
      ...userPrivateMetadata,
      stripeCustomerId: stripeCustomer.id,
    } satisfies Partial<UserObjectCustomized["privateMetadata"]>,
  });
}
