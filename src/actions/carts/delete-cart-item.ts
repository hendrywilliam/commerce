"use server";

import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { CartItem } from "@/types";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { Product, carts } from "@/db/schema";

export async function deleteCartItemAction(productId: Product["id"]) {
  const cartId = cookies().get("cart_id")?.value;

  if (isNaN(Number(cartId))) {
    throw new Error("Invalid cart id.");
  }

  const cartItems = await db
    .select()
    .from(carts)
    .where(eq(carts.id, Number(cartId)));

  const parsedCartItems = JSON.parse(
    cartItems[0].items as string,
  ) as CartItem[];

  const isDesiredItemExistInCart = parsedCartItems.find(
    (item) => item.id === productId,
  );

  const filteredItemsInCart =
    isDesiredItemExistInCart &&
    parsedCartItems.filter((item) => item.id !== productId);

  // Update cart
  await db
    .update(carts)
    .set({
      items: JSON.stringify(filteredItemsInCart),
    })
    .where(eq(carts.id, Number(cartId)));

  revalidatePath("/");
}
