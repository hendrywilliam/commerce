"use server";

import { db } from "@/db/core";
import "dotenv/config";
import { stores } from "@/db/schema";
import { getErrorMessage, getSubscriptionPlan, slugify } from "@/lib/utils";
import { NewStore } from "@/db/schema";
import { TweakedOmit } from "@/lib/utils";
import { redirect } from "next/navigation";
import { and, not, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import type { UserObjectCustomized } from "@/types";
import { newStoreValidation } from "@/lib/validations/stores";

export async function createNewStore(
    storeData: TweakedOmit<NewStore, "slug" | "createdAt">
): Promise<{ data?: string; error?: string } | void> {
    try {
        await db.transaction(async (tx) => {
            const user = (await currentUser()) as UserObjectCustomized | null;

            if (!user) {
                throw new Error("You must be signed in to create a new store");
            }

            const validateStoreData = await newStoreValidation.spa(storeData);

            if (!validateStoreData.success) {
                throw new Error(validateStoreData.error.message);
            }

            const store = await db.query.stores.findFirst({
                where: storeData.id
                    ? and(
                          not(eq(stores.id, storeData.id)),
                          eq(stores.name, storeData.name)
                      )
                    : eq(stores.name, storeData.name),
            });

            if (store) {
                throw new Error("Store is already exist with that name.");
            }

            const privateMetadata = user.privateMetadata;
            const subscribedPlanId = privateMetadata.subscribedPlanId;
            const plan = getSubscriptionPlan(subscribedPlanId);
            const isAbleToCreateNewStore =
                plan && privateMetadata.storeId.length < plan.limit;

            if (isAbleToCreateNewStore) {
                const store = await db
                    .insert(stores)
                    .values({
                        name: storeData.name,
                        description: storeData.description,
                        slug: slugify(storeData.name),
                    })
                    .returning({
                        insertedId: stores.id,
                        storeName: stores.name,
                    })
                    .then((result) => ({
                        insertedId: result[0].insertedId,
                        storeName: result[0].storeName,
                    }));

                await clerkClient.users.updateUser(user.id, {
                    privateMetadata: {
                        ...privateMetadata,
                        storeId: [...privateMetadata.storeId, store.insertedId],
                    },
                });

                revalidatePath("/dashboard");
            } else {
                throw new Error(
                    "New store creation limit reached. Please update your subscription plan."
                );
            }
        });
        redirect("/dashboard");
    } catch (error) {
        return {
            error: getErrorMessage(error),
        };
    }
}
