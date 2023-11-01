import { formatCurrency } from "@/lib/utils";
import type { CartLineDetailedItems } from "@/types";
import ShoppingCartItemAction from "@/components/lobby/shopping-cart-item-action";
import { truncate } from "@/lib/utils";
import Image from "next/image";

interface ShoppingCartItemProps {
  cartLineDetailedItem: CartLineDetailedItems;
}

export default function ShoppingCartItem({
  cartLineDetailedItem,
}: ShoppingCartItemProps) {
  const sumPriceForItem =
    Number(cartLineDetailedItem.price) * cartLineDetailedItem.qty;

  const parsedImageUrl = JSON.parse(cartLineDetailedItem.image)[0].fileUrl;

  return (
    <div className="inline-flex w-full h-20 gap-2 py-2 border-b">
      <div className="relative w-16 h-full border rounded">
        <Image
          src={parsedImageUrl}
          fill
          alt={cartLineDetailedItem.name}
          className="object-cover rounded"
        />
      </div>
      <div className="flex flex-col flex-1 justify-center">
        <p>{truncate(cartLineDetailedItem.name)}</p>
        <p className="text-gray-400 text-xs">
          <span>
            {cartLineDetailedItem.qty} x{" "}
            {formatCurrency(Number(cartLineDetailedItem.price))} -
          </span>
          <span> {formatCurrency(sumPriceForItem)}</span>
        </p>
        <p className="text-gray-400 text-xs">{cartLineDetailedItem.category}</p>
      </div>
      <ShoppingCartItemAction
        id={cartLineDetailedItem.id}
        qty={cartLineDetailedItem.qty}
      />
    </div>
  );
}
