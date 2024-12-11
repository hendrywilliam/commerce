import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import ImagePlaceholder from "@/components/image-placeholder";
import type { CartLineDetailedItems, UploadData } from "@/types";
import CartItemAction from "@/components/lobby/cart/cart-item-action";

interface CartItemProps {
  cartItem: CartLineDetailedItems;
}

export default function CartItem({ cartItem }: CartItemProps) {
  const cartProductImage = cartItem.image[0].url;

  return (
    <div className="flex h-full w-full gap-4 py-4">
      <div className="relative h-20 w-24 rounded border">
        {cartProductImage ? (
          <Image
            src={cartProductImage}
            fill
            alt={cartItem.name ?? "Product Image"}
            className="rounded object-cover"
          />
        ) : (
          <ImagePlaceholder />
        )}
      </div>
      <div className="flex w-full flex-col">
        <p>{cartItem.name}</p>
        <p className="text-gray-400">
          {formatCurrency(Number(cartItem.price) * cartItem.qty)}
        </p>
        <CartItemAction cartItem={cartItem} />
      </div>
    </div>
  );
}
