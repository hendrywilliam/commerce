import Image from "next/image";
import { formatCurrency, parse_to_json } from "@/lib/utils";
import ImagePlaceholder from "@/components/image-placeholder";
import type { CartLineDetailedItems, UploadData } from "@/types";
import CartItemAction from "@/components/lobby/cart/cart-item-action";

interface CartItemProps {
  cartItem: CartLineDetailedItems;
}

export default function CartItem({ cartItem }: CartItemProps) {
  const parsedImage = parse_to_json<UploadData[]>(cartItem.image)[0].url;

  return (
    <div className="flex py-4 gap-4 w-full h-full">
      <div className="relative w-24 h-20 border rounded">
        {parsedImage ? (
          <Image
            src={parsedImage}
            fill
            alt={cartItem.name ?? "Product Image"}
            className="object-cover rounded"
          />
        ) : (
          <ImagePlaceholder />
        )}
      </div>
      <div className="flex flex-col w-full">
        <p>{cartItem.name}</p>
        <p className="text-gray-400">
          {formatCurrency(Number(cartItem.price) * cartItem.qty)}
        </p>
        <CartItemAction cartItem={cartItem} />
      </div>
    </div>
  );
}
