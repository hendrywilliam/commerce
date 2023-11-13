"use client";

import {
  IconTrashCan,
  IconArrowUp,
  IconArrowDown,
  IconStores,
  IconLoading,
} from "@/components/ui/icons";
import { toast } from "sonner";
import { catchError, slugify } from "@/lib/utils";
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
  const [productQuantity, setProductQuantity] = useState(cartItem.qty);
  const [isPending, startTransition] = useTransition();
  const [isDeletingCurrentItem, setIsDeletingCurrentItem] = useState(false);

  const router = useRouter();

  function deleteCurrentItemInCart() {
    startTransition(async () => {
      setIsDeletingCurrentItem(
        (isDeletingCurrentItem) => !isDeletingCurrentItem
      );
      try {
        await deleteCartItemAction(cartItem.id);
        toast.success("Your cart has been updated.");
      } catch (err) {
        catchError(err);
      } finally {
        setIsDeletingCurrentItem(
          (isDeletingCurrentItem) => !isDeletingCurrentItem
        );
      }
    });
  }

  useEffect(() => {
    const bounceUpdate = setTimeout(() => {
      startTransition(async () => {
        await updateCartItemAction(cartItem.id, productQuantity);
        toast.success("Your cart has been updated.");
      });
    }, 500);

    return () => clearTimeout(bounceUpdate);
    // eslint-disable-next-line
  }, [productQuantity]);

  return (
    <div className="flex justify-between gap-4 h-full w-full py-2">
      <div>
        <Button
          onClick={() =>
            void router.push(
              `/product/${cartItem.id}/${slugify(cartItem.name)}`
            )
          }
          className="w-6 h-6"
          size={"icon"}
          variant={"outline"}
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
            size={"icon"}
            variant={"outline"}
            onClick={() =>
              void setProductQuantity((productQuantity) => productQuantity + 1)
            }
          >
            <IconArrowUp />
          </Button>
          <Input
            value={productQuantity}
            min={1}
            type="number"
            className="w-16 h-6 p-2"
            onChange={(e) =>
              setProductQuantity((productQuantity) =>
                productQuantity > 1 ? e.target.valueAsNumber : 1
              )
            }
          />
          <Button
            disabled={isPending}
            aria-disabled={isPending ? "true" : "false"}
            className="w-6 h-6"
            size={"icon"}
            variant={"outline"}
            onClick={() =>
              void setProductQuantity((productQuantity) =>
                productQuantity > 1 ? productQuantity - 1 : 1
              )
            }
          >
            <IconArrowDown />
          </Button>
        </div>
        <div>
          <Button
            onClick={() => void deleteCurrentItemInCart()}
            className="w-6 h-6"
            size={"icon"}
            variant={"outline"}
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
