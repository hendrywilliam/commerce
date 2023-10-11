"use server";
import { db } from "@/db/core";
import { stores } from "@/db/schema";

export async function getAllStores() {
  return await db.select().from(stores);
}
