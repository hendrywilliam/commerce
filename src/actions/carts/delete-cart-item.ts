"use server";

import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { CartItem } from "@/types";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { Product, carts, products } from "@/db/schema";

export async function deleteCartItemAction(
  productId: Product["id"],
): Promise<string> {
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

  const targetItem = parsedCartItems.find(
    (item) => item.id === productId,
  ) as CartItem;

  const filteredItems =
    targetItem && parsedCartItems.filter((item) => item.id !== productId);

  const detailedItem = (await db.query.products.findFirst({
    where: eq(products.id, targetItem.id),
  })) as Product;

  // Update cart
  await db
    .update(carts)
    .set({
      items: JSON.stringify(filteredItems),
    })
    .where(eq(carts.id, Number(cartId)));

  revalidatePath("/");
  return detailedItem.name;
}
