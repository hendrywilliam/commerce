"use server";
import type { CartItem } from "@/types";
import { db } from "@/db/core";
import { products } from "@/db/schema";
import { inArray } from "drizzle-orm";

export async function getCartDetails(cartItems: CartItem[]) {
  if (cartItems.length === 0) {
    return [];
  }

  const getAllCartItemsId = cartItems.map((item) => item.id);
  return await db
    .select()
    .from(products)
    .where(inArray(products.id, getAllCartItemsId));
}
