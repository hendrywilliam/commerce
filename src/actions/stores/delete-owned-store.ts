"use server";
import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Store, stores } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { UserObjectCustomized } from "@/types";
import { currentUser, clerkClient } from "@clerk/nextjs/server";

export async function deleteOwnedStoreAction(id: Store["id"]) {
    const user = (await currentUser()) as UserObjectCustomized | null;

    if (!user) {
        redirect("/sign-in");
    }

    await db.delete(stores).where(eq(stores.id, id));
    const filterDeletedStore = user.privateMetadata.storeId.filter(
        (item) => item !== id
    );

    const userDataPrivateMetadata = user.privateMetadata;
    await clerkClient.users.updateUser(user.id, {
        privateMetadata: {
            ...userDataPrivateMetadata,
            storeId: [...filterDeletedStore],
        },
    });

    revalidatePath("/dashboard");
    redirect("/dashboard");
}
