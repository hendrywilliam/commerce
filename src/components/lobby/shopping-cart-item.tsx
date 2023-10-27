import type { Product } from "@/db/schema";
import { formatCurrency } from "@/lib/utils";
import { CartItem, CartLineDetailedItems } from "@/types";

interface ShoppingCartItemProps {
  cartLineDetailedItem: CartLineDetailedItems;
  quantity: number;
}

export default function ShoppingCartItem({
  cartLineDetailedItem,
  quantity,
}: ShoppingCartItemProps) {
  const sumPriceForItem = Number(cartLineDetailedItem.price) * quantity;

  return (
    <div className="inline-flex w-full h-12 mt-1 gap-2">
      <div className="w-12 h-full border rounded">{/* for image later */}</div>
      <div className="flex-1">
        <p>{cartLineDetailedItem.name}</p>
        <p>{cartLineDetailedItem.category}</p>
      </div>
      <div>
        <p>{formatCurrency(sumPriceForItem)}</p>
        <p>{quantity}</p>
      </div>
    </div>
  );
}
