"use server";

import { z } from "zod";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { clerkClient } from "@clerk/nextjs";
import { registerValidation } from "@/lib/validations/user";

type CreateUser = z.infer<typeof registerValidation>;

export async function createUserAction(rawUserData: CreateUser) {
  try {
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
        stripeCustomerId: "",
      },
    });

    if (!userCreated) {
      throw new Error("Unable to create an user for now. Try again later.");
    }

    // Register user to Stripe.
    const stripeCustomer: Stripe.Customer =
      userCreated &&
      (await stripe.customers.create({
        email: userCreated.emailAddresses[0].emailAddress,
      }));

    const userCreatedPublicMetadata = userCreated.publicMetadata;

    await clerkClient.users.updateUser(userCreated.id, {
      publicMetadata: {
        ...(userCreated && userCreatedPublicMetadata),
        stripeCustomerId: stripeCustomer.id,
      },
    });
  } catch (error) {
    throw error;
  }
}
