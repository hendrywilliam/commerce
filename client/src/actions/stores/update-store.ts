"use server";

import { db } from "@/db/core";
import { eq, and, not } from "drizzle-orm";
import { Store } from "@/db/schema";
import { stores } from "@/db/schema";
import { getErrorMessage, slugify } from "@/lib/utils";
import { TweakedOmit } from "@/lib/utils";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";
import { storeValidation } from "@/lib/validations/stores";
import { UserObjectCustomized } from "@/types";

export async function updateOwnedStoreAction(
    rawInput: TweakedOmit<Store, "createdAt" | "active" | "slug">
): Promise<{ error?: string } | void> {
    try {
        await db.transaction(async (tx) => {
            const user = (await currentUser()) as UserObjectCustomized | null;

            if (!user) {
                throw new Error("You must be signed in to update the store.");
            }

            const parsed = await storeValidation.spa(rawInput);

            if (!parsed.success) {
                throw new Error(parsed.error.issues[0].message);
            }

            const store = await db.query.stores.findFirst({
                where: rawInput.id
                    ? and(
                          not(eq(stores.id, rawInput.id)),
                          eq(stores.name, parsed.data.name)
                      )
                    : eq(stores.name, parsed.data.name),
            });

            if (store) {
                throw new Error("Store is already exist with that name.");
            }

            await db
                .update(stores)
                .set({
                    description: parsed.data.description,
                    name: parsed.data.name,
                    slug: slugify(parsed.data.name),
                })
                .where(eq(stores.id, rawInput.id));

            revalidatePath("/dashboard/stores");
        });
        redirect("/dashboard/stores");
    } catch (error) {
        return {
            error: getErrorMessage(error),
        };
    }
}
