import Image from "next/image";
import type { UploadData } from "@/types";
import { formatCurrency, truncate } from "@/lib/utils";
import type { CartLineDetailedItems } from "@/types";
import ImagePlaceholder from "@/components/image-placeholder";
import ShoppingCartItemAction from "@/components/lobby/shopping-cart-item-action";

interface ShoppingCartItemProps {
  cartLineDetailedItem: CartLineDetailedItems;
}

export default function ShoppingCartItem({
  cartLineDetailedItem,
}: ShoppingCartItemProps) {
  const sumPriceForItem =
    Number(cartLineDetailedItem.price) * cartLineDetailedItem.qty;

  return (
    <div className="inline-flex h-20 w-full gap-2 border-b py-2">
      <div className="relative h-full w-16 rounded border">
        {cartLineDetailedItem.image[0].url ? (
          <Image
            src={cartLineDetailedItem.image[0].url}
            fill
            alt={cartLineDetailedItem.name}
            className="rounded object-cover"
          />
        ) : (
          <ImagePlaceholder />
        )}
      </div>
      <div className="flex flex-1 flex-col justify-center">
        <p>{truncate(cartLineDetailedItem.name)}</p>
        <p className="text-xs text-gray-400">
          <span>
            {cartLineDetailedItem.qty} x{" "}
            {formatCurrency(Number(cartLineDetailedItem.price))} -
          </span>
          <span> {formatCurrency(sumPriceForItem)}</span>
        </p>
        <p className="text-xs text-gray-400">{cartLineDetailedItem.category}</p>
      </div>
      <ShoppingCartItemAction
        id={cartLineDetailedItem.id}
        qty={cartLineDetailedItem.qty}
      />
    </div>
  );
}
