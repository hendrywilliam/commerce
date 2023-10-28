"use server";
import { db } from "@/db/core";
import { carts } from "@/db/schema";
import { CartItem } from "@/types";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function updateCartItemAction(itemId: number, quantity: number) {
  const cartId = cookies().get("cart_id")?.value;

  if (isNaN(Number(cartId)))
    throw new Error("Invalid cart id. Try again later.");

  const cartItems = await db
    .select()
    .from(carts)
    .where(eq(carts.id, Number(cartId)));

  const allItemsInCart =
    cartItems && (JSON.parse(cartItems[0].items as string) as CartItem[]);

  const isSelectedItemExistInCart = allItemsInCart.find(
    (cartItem) => cartItem.id === itemId
  );

  if (!isSelectedItemExistInCart)
    throw new Error("Item doesnt exist in cart. Please try again later.");

  const anyItemExcludingSelectedItem =
    isSelectedItemExistInCart &&
    allItemsInCart.filter((item) => item.id !== isSelectedItemExistInCart.id);

  // Check quantity is gt than 0 -> update qty
  // Else -> remove selected item.
  if (quantity > 0) {
    await db
      .update(carts)
      .set({
        items:
          allItemsInCart &&
          JSON.stringify([
            ...anyItemExcludingSelectedItem,
            {
              ...isSelectedItemExistInCart,
              qty: quantity,
            },
          ]),
      })
      .where(eq(carts.id, Number(cartId)));
  } else {
    await db
      .update(carts)
      .set({
        items: JSON.stringify([...anyItemExcludingSelectedItem]),
      })
      .where(eq(carts.id, Number(cartId)));
  }

  revalidatePath("/");
}
