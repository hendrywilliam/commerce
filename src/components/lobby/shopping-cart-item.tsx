import type { Product } from "@/db/schema";

interface ShoppingCartItemProps {
  product: Product;
}

export default function ShoppingCartItem({ product }: ShoppingCartItemProps) {
  return (
    <div className="inline-flex w-full h-8 mt-1">
      <div className="border w-full p-1 rounded">{product.name}</div>
    </div>
  );
}
