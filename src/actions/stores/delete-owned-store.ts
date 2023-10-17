"use server";
import { db } from "@/db/core";
import { stores } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteOwnedStore(id: number) {
  await db.delete(stores).where(eq(stores.id, id));

  revalidatePath("/");
  redirect("/dashboard/stores");
}
