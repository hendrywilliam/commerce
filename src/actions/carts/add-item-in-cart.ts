"use server";

import { db } from "@/db/core";
import { carts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { CartItem } from "@/types";

export async function AddItemInCartAction(newCartItem: CartItem) {
  const cartId = cookies().get("cart_id")?.value;
  const cartDetails =
    cartId &&
    (await db
      .select()
      .from(carts)
      .where(eq(carts.id, Number(cartId))));

  const cartAvailableAndOpen = cartDetails && !cartDetails[0].isClosed;

  if (cartAvailableAndOpen) {
    const cartItems = await db
      .select()
      .from(carts)
      .where(eq(carts.id, Number(cartId)));

    const allItemsInCart = JSON.parse(
      cartItems[0].items as string
    ) as CartItem[];

    const anyItemsExcludingNewCartItem = allItemsInCart.filter((item) => {
      return item.id !== newCartItem.id;
    }) as CartItem[];

    // is the new item exist in the cart? -> add new qty later
    const newCartItemInCart = allItemsInCart.find(
      (item) => item.id === newCartItem.id
    );

    await db
      .update(carts)
      .set({
        items: allItemsInCart
          ? JSON.stringify([
              ...anyItemsExcludingNewCartItem,
              {
                ...newCartItem,
                qty: newCartItemInCart
                  ? newCartItem.qty + newCartItemInCart.qty
                  : newCartItem.qty,
              },
            ])
          : JSON.stringify([newCartItem]),
      })
      .where(eq(carts.id, Number(cartId)));

    revalidatePath("/");
  } else {
    const { insertId } = await db.insert(carts).values({
      items: JSON.stringify([newCartItem]),
    });
    cookies().set("cart_id", String(insertId));
    revalidatePath("/");
  }
}
