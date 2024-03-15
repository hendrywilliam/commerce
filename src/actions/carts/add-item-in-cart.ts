"use server";

import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import type { CartItem } from "@/types";
import { revalidatePath } from "next/cache";
import { carts, products } from "@/db/schema";

export async function addItemInCartAction(newCartItem: CartItem) {
  const cartId = cookies().get("cart_id")?.value;

  const isCartExist =
    !isNaN(Number(cartId)) &&
    (await db
      .select()
      .from(carts)
      .where(eq(carts.id, Number(cartId)))
      .limit(1));

  // Check cart availability
  const cartAvailableAndOpen =
    isCartExist && isCartExist.length && !isCartExist[0]?.isClosed;

  if (cartAvailableAndOpen) {
    const cartItems = await db
      .select()
      .from(carts)
      .where(eq(carts.id, Number(cartId)));

    const allItemsInCart = JSON.parse(
      cartItems[0].items as string,
    ) as CartItem[];

    const anyItemsExcludingNewCartItem = allItemsInCart.filter((item) => {
      return item.id !== newCartItem.id;
    }) as CartItem[];

    const newCartItemInCart = allItemsInCart.find(
      (item) => item.id === newCartItem.id,
    );

    const newCartItemDetails = await db.query.products.findFirst({
      where: eq(products.id, newCartItem.id),
    });

    if (!newCartItemDetails) {
      throw new Error(
        "Product does not exist in store. Please try again or contact the store.",
      );
    }

    if (newCartItem.qty + newCartItemInCart?.qty! > newCartItemDetails.stock) {
      throw new Error("Stock limit exceeds.");
    }

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
