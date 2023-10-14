"use server";

import { db } from "@/db/core";
import { carts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import type { CartItem } from "@/types";

export async function getCart() {
  const cartCookie = cookies().get("cart_id")?.value;

  if (isNaN(Number(cartCookie))) {
    return [];
  }

  const cartDetail = (
    await db
      .select()
      .from(carts)
      .where(eq(carts.id, Number(cartCookie)))
      .limit(1)
  )[0].items;

  const parseCartDetailItems = JSON.parse(cartDetail as string) as CartItem[];

  return parseCartDetailItems;
}
