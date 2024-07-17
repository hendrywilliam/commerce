"use server";

import { Store, stores } from "@/db/schema";
import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getErrorMessage } from "@/lib/utils";

export async function updateStoreStatus({
    store_id,
}: {
    store_id: Store["id"];
}): Promise<{ data?: string; error?: string }> {
    try {
        const details = await db.transaction(async (tx) => {
            const store = await db.query.stores.findFirst({
                where: eq(stores.id, store_id),
            });

            if (!store) {
                throw new Error("Invalid store. Please try again.");
            }

            const updatedStore = await db
                .update(stores)
                .set({
                    active: !store.active,
                })
                .where(eq(stores.id, store_id))
                .returning({
                    name: stores.name,
                });

            if (!updatedStore) {
                throw new Error("Failed to update the store. Try again later.");
            }

            revalidatePath(`/dashboard/stores/${store.slug}`);
            return updatedStore[0].name;
        });
        return {
            data: details,
        };
    } catch (error) {
        return {
            error: getErrorMessage(error),
        };
    }
}
