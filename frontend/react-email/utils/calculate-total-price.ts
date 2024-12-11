import type { Product } from "@/db/schema";
import type { Extends } from "@/lib/utils";

export function calculateTotalPrice(
  products: Extends<Product, { qty: number }>[],
) {
  return products.reduce(
    (total, product) => total + Number(product.price) * product.qty,
    0,
  );
}
