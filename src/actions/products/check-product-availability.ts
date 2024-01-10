"use server";

import { db } from "@/db/core";
import { and, eq } from "drizzle-orm";
import { products } from "@/db/schema";

export async function check_product_availability_action({
  productId,
  productName,
}: {
  productName: string;
  productId?: number;
}) {
  const product = await db.query.products.findFirst({
    where: productId
      ? and(eq(products.id, productId), eq(products.name, productName))
      : eq(products.name, productName),
  });

  if (product) {
    throw new Error("Product is already exist.");
  }

  return;
}
