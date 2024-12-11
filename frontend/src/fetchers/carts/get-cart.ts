"use server";

import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { carts } from "@/db/schema";
import { cookies } from "next/headers";
import type { CartItem } from "@/types";
import { getCartDetailsFetcher } from "@/fetchers/carts/get-cart-details";

export async function getCartFetcher() {
  const cartId = cookies().get("cart_id")?.value;

  const isCartExist =
    !isNaN(Number(cartId)) &&
    (await db
      .select()
      .from(carts)
      .where(eq(carts.id, Number(cartId))));

  const cartItems = isCartExist
    ? ((
        await db
          .select()
          .from(carts)
          .where(eq(carts.id, Number(cartId)))
          .limit(1)
      )[0]?.items as CartItem[])
    : [];

  // // // Get all items from the cart.
  const items = cartItems?.length ? (cartItems as CartItem[]) : [];

  // Get all item details based on the parsedCartItems above.
  const cartItemDetails = await getCartDetailsFetcher(Number(cartId), items);

  return {
    items,
    cartItemDetails,
  };
}
