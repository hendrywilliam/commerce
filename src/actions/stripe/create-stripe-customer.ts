"use server";

import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { clerkClient } from "@clerk/nextjs/server";
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
        firstName: parsedRawData.data.firstname,
        lastName: parsedRawData.data.lastname,
        privateMetadata: {
            storeId: [],
            // Set default plan id to hobby.
            subscribedPlanId: process.env["HOBBY_PLAN_ID"],
        },
    });

    if (!userCreated) {
        throw new Error("Unable to create an user for now. Try again later.");
    }

    const email = getPrimaryEmail(userCreated);

    // Register user to Stripe.
    const stripeCustomer: Stripe.Customer = await stripe.customers.create({
        email,
        name: `${userCreated.firstName} ${userCreated.lastName}`,
        metadata: {
            clerkId: userCreated.id,
        },
    });

    const userPrivateMetadata = userCreated.privateMetadata;

    await clerkClient.users.updateUser(userCreated.id, {
        privateMetadata: {
            ...userPrivateMetadata,
            stripeCustomerId: stripeCustomer.id,
        } satisfies Partial<UserObjectCustomized["privateMetadata"]>,
    });
}
