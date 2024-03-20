"use server";

import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { CartItem } from "@/types";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { Cart, Product, carts, products } from "@/db/schema";

export async function deleteCartItemAction(
  productId: Product["id"],
): Promise<string> {
  const cartId = cookies().get("cart_id")?.value;

  if (isNaN(Number(cartId))) {
    throw new Error("Invalid cart id. Please try again later.");
  }

  const cart = (await db.query.carts.findFirst({
    where: eq(carts.id, Number(cartId)),
  })) as Cart;

  const cartItem = cart.items as CartItem[];

  const targetItem = cartItem.find((item) => item.id === productId) as CartItem;

  const filteredItems =
    targetItem && cartItem.filter((item) => item.id !== targetItem.id);

  const detailedItem = (await db.query.products.findFirst({
    where: eq(products.id, targetItem.id),
  })) as Product;

  // Update cart
  await db
    .update(carts)
    .set({
      items: filteredItems,
    })
    .where(eq(carts.id, Number(cartId)));

  revalidatePath("/");
  return detailedItem.name;
}
