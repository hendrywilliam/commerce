"use client";

import {
  IconTrashCan,
  IconArrowUp,
  IconArrowDown,
  IconStores,
  IconLoading,
} from "@/components/ui/icons";
import { toast } from "sonner";
import { catchError } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { CartLineDetailedItems } from "@/types";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useTransition } from "react";
import { updateCartItemAction } from "@/actions/carts/update-cart-item";
import { deleteCartItemAction } from "@/actions/carts/delete-cart-item";

interface CartItemActionProps {
  cartItem: CartLineDetailedItems;
}

export default function CartItemAction({ cartItem }: CartItemActionProps) {
  const [isNewValue, setIsNewValue] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [productQuantity, setProductQuantity] = useState(cartItem.qty);
  const [isDeletingCurrentItem, setIsDeletingCurrentItem] = useState(false);

  const { push } = useRouter();

  function deleteCurrentItemInCart() {
    startTransition(async () => {
      setIsDeletingCurrentItem(
        (isDeletingCurrentItem) => !isDeletingCurrentItem,
      );
      try {
        await deleteCartItemAction(cartItem.id);
        toast.success("Item successfully removed from your cart.");
      } catch (err) {
        catchError(err);
      } finally {
        setIsDeletingCurrentItem(
          (isDeletingCurrentItem) => !isDeletingCurrentItem,
        );
      }
    });
  }

  useEffect(() => {
    const bounceUpdate = setTimeout(() => {
      startTransition(async () => {
        // It wont run the update at initial render.
        if (isNewValue) {
          await updateCartItemAction(cartItem.id, productQuantity);
          toast.success("Your cart has been updated.");
        }
      });
    }, 500);

    return () => clearTimeout(bounceUpdate);
    // eslint-disable-next-line
  }, [productQuantity]);

  return (
    <div className="flex justify-between gap-4 h-full w-full py-2">
      <div>
        <Button
          onClick={() => void push(`/store/${cartItem.storeSlug}`)}
          className="w-6 h-6"
          size="icon"
          variant="outline"
        >
          <IconStores />
        </Button>
      </div>
      <div className="inline-flex gap-4">
        <div className="flex gap-1">
          <Button
            disabled={isPending}
            aria-disabled={isPending ? "true" : "false"}
            className="w-6 h-6"
            size="icon"
            variant="outline"
            onClick={() => {
              setProductQuantity((productQuantity) => productQuantity + 1);
              setIsNewValue(true);
            }}
          >
            <IconArrowUp />
          </Button>
          <Input
            value={productQuantity}
            min={1}
            type="number"
            disabled={isPending}
            aria-disabled={isPending ? "true" : "false"}
            className="w-16 h-6 p-2"
            onChange={(e) => {
              setProductQuantity((productQuantity) =>
                productQuantity > 1 ? e.target.valueAsNumber : 1,
              );
              setIsNewValue(true);
            }}
          />
          <Button
            disabled={isPending}
            aria-disabled={isPending ? "true" : "false"}
            className="w-6 h-6"
            size="icon"
            variant="outline"
            onClick={() => {
              setProductQuantity((productQuantity) => productQuantity - 1);
              setIsNewValue(true);
            }}
          >
            <IconArrowDown />
          </Button>
        </div>
        <div>
          <Button
            onClick={() => void deleteCurrentItemInCart()}
            className="w-6 h-6"
            size="icon"
            variant="outline"
            disabled={isDeletingCurrentItem}
            aria-disabled={isDeletingCurrentItem ? "true" : "false"}
          >
            {isDeletingCurrentItem ? <IconLoading /> : <IconTrashCan />}
          </Button>
        </div>
      </div>
    </div>
  );
}
