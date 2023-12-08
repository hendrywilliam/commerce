"use server";

import { db } from "@/db/core";
import { carts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import type { CartItem } from "@/types";
import { getCartDetailsAction } from "@/actions/carts/get-cart-details";

export async function getCartAction() {
  const cartId = cookies().get("cart_id")?.value;

  // Check if the cart is exist, and not the imaginary / made up one.
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
      )[0]?.items as string)
    : [];

  // Get all items from the cart.
  const parsedCartItems = cartItems?.length
    ? (JSON.parse(cartItems as string) as CartItem[])
    : [];

  // Get all item details based on the parsedCartItems above.
  const cartItemDetails = await getCartDetailsAction(
    Number(cartId),
    parsedCartItems,
  );

  return {
    parsedCartItems,
    cartItemDetails,
  };
}
