"use server";

import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { clerkClient } from "@clerk/nextjs";
import { getPrimaryEmail } from "@/lib/utils";
import { UserObjectCustomized } from "@/types";
import { CreateUser } from "@/lib/validations/user";
import { registerValidation } from "@/lib/validations/user";

// This will create clerk user and stripe customer
export async function createStripeCustomerAction(rawUserData: CreateUser) {
  const parsedRawData = await registerValidation.spa(rawUserData);

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
