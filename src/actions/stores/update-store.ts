"use server";

import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { Store } from "@/db/schema";
import { stores } from "@/db/schema";
import { slugify } from "@/lib/utils";
import { TweakedOmit } from "@/lib/utils";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";
import { storeValidation } from "@/lib/validations/stores";
import { checkStoreAvailabilityAction } from "./check-store-availability";

export async function updateOwnedStoreAction(
    storeRawInput: TweakedOmit<Store, "createdAt" | "active" | "slug">
) {
    const user = await currentUser();

    if (!user) {
        throw new Error("You must be signed in to update the store.");
    }

    const parseStoreRawInput = await storeValidation.spa(storeRawInput);

    if (!parseStoreRawInput.success) {
        throw new Error(parseStoreRawInput.error.issues[0].message);
    }

    await checkStoreAvailabilityAction({
        storeName: parseStoreRawInput.data.name,
        storeId: storeRawInput.id,
    });

    await db
        .update(stores)
        .set({
            description: parseStoreRawInput.data.description,
            name: parseStoreRawInput.data.name,
            slug: slugify(parseStoreRawInput.data.name),
        })
        .where(eq(stores.id, storeRawInput.id));

    revalidatePath("/dashboard/stores");
    redirect("/dashboard/stores");
}
