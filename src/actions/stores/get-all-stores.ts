"use server";

import { db } from "@/db/core";
import { stores } from "@/db/schema";
import { asc } from "drizzle-orm";

export async function getAllStoresAction() {
  return await db.select().from(stores).orderBy(asc(stores.name));
}
