"use server";

import { db } from "@/db/core";
import { CartItem } from "@/types";
import { stores } from "@/db/schema";
import { products } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { CartLineDetailedItems } from "@/types";

export async function getCartDetailsFetcher(
  cartId: number,
  cartItems: CartItem[],
) {
  if (isNaN(cartId)) return [];

  if (cartItems && cartItems.length === 0) return [];

  const productIds = cartItems.map((item) => item.id);

  const cartItemDetails = await db
    .select({
      id: products.id,
      name: products.name,
      price: products.price,
      category: products.category,
      image: products.image,
      stock: products.stock,
      storeId: products.storeId,
      storeName: stores.name,
      storeSlug: stores.slug,
    })
    .from(products)
    .leftJoin(stores, eq(products.storeId, stores.id))
    .where(inArray(products.id, productIds))
    .execute()
    .then((products) => {
      return products.map((product) => {
        const qty = cartItems.find((cartItem) => cartItem.id === product.id)
          ?.qty;
        return {
          ...product,
          qty: qty ?? 0,
        };
      });
    });

  return cartItemDetails as CartLineDetailedItems[];
}
