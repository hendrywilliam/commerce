"use server";

import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import type { CartItem } from "@/types";
import { revalidatePath } from "next/cache";
import { Cart, carts, Product, products } from "@/db/schema";
import { getErrorMessage } from "@/lib/utils";

export async function addItemToCart(
    newCartItem: CartItem
): Promise<{ data?: Product; error?: string }> {
    try {
        const cartId = cookies().get("cart_id")?.value;
        const isCartExist =
            !isNaN(Number(cartId)) &&
            (await db
                .select()
                .from(carts)
                .where(eq(carts.id, Number(cartId)))
                .limit(1));

        const cartAvailableAndOpen =
            isCartExist && isCartExist.length && !isCartExist[0]?.isClosed;

        if (cartAvailableAndOpen) {
            const details = await db.transaction(async (tx) => {
                const cart = (await db.query.carts.findFirst({
                    where: eq(carts.id, Number(cartId)),
                })) as Cart;

                const cartItems = cart.items as CartItem[];

                const excludingNewItem = cartItems.filter((cartItem) => {
                    return cartItem.id !== newCartItem.id;
                }) as CartItem[];

                const targetItemInCart = cartItems.find(
                    (cartItem) => cartItem.id === newCartItem.id
                );

                const newCartItemDetails = await db.query.products.findFirst({
                    where: eq(products.id, newCartItem.id),
                });

                if (!newCartItemDetails) {
                    throw new Error(
                        "Product does not exist in store. Please try again or contact the store."
                    );
                }

                if (
                    newCartItem.qty + (targetItemInCart?.qty ?? 0) >
                    newCartItemDetails.stock
                ) {
                    throw new Error("Stock limit exceeds.");
                }

                await db
                    .update(carts)
                    .set({
                        items: cartItems
                            ? [
                                  ...excludingNewItem,
                                  {
                                      ...newCartItem,
                                      qty: targetItemInCart
                                          ? newCartItem.qty +
                                            targetItemInCart.qty
                                          : newCartItem.qty,
                                  },
                              ]
                            : [newCartItem],
                    })
                    .where(eq(carts.id, Number(cartId)));
                return newCartItemDetails;
            });
            revalidatePath("/");
            return {
                data: details,
            };
        }

        const details = await db.transaction(async (tx) => {
            const itemDetails = await db.query.products.findFirst({
                where: eq(products.id, newCartItem.id),
            });
            const { insertedId } = await db
                .insert(carts)
                .values({
                    items: [newCartItem],
                })
                .returning({ insertedId: carts.id })
                .then((result) => ({
                    insertedId: result[0].insertedId,
                }));

            if (!insertedId) {
                throw new Error("Failed to add item. Try again later.");
            }

            cookies().set("cart_id", String(insertedId));
            return itemDetails;
        });
        revalidatePath("/");
        return {
            data: details,
        };
    } catch (error) {
        return {
            error: getErrorMessage(error),
        };
    }
}
