"use client";

import { CartItem } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconTrashCan, IconLoading } from "@/components/ui/icons";
import { useState, useEffect, useTransition } from "react";
import { deleteCartItemAction } from "@/actions/carts/delete-cart-item";
import { catchError } from "@/lib/utils";
import { toast } from "sonner";
import { updateCartItemAction } from "@/actions/carts/update-cart-item";

interface ShoppingCartItemActionProps {
  id: number;
  qty: number;
}

export default function ShoppingCartItemAction({
  id,
  qty,
}: ShoppingCartItemActionProps) {
  const [itemQuantity, setItemQuantity] = useState(qty);
  const [isPending, startTransition] = useTransition();
  const [isDeletingItem, setIsDeletingItem] = useState(false);

  async function handleDeleteItemFromCart() {
    setIsDeletingItem((isDeletingItem) => !isDeletingItem);
    startTransition(async () => {
      try {
        await deleteCartItemAction(id);
        toast.success("Your cart has been updated.");
      } catch (err) {
        catchError(err);
      } finally {
        setIsDeletingItem((isDeletingItem) => !isDeletingItem);
      }
    });
  }

  useEffect(() => {
    const bounceUpdate = setTimeout(async () => {
      startTransition(async () => {
        await updateCartItemAction(id, itemQuantity);
      });
    }, 500);

    return () => clearTimeout(bounceUpdate);
    // eslint-disable-next-line
  }, [itemQuantity]);

  return (
    <div className="flex flex-col gap-2">
      <div className="w-full flex justify-end">
        <Button
          onClick={handleDeleteItemFromCart}
          variant={"outline"}
          size={"icon"}
          className="h-6 w-6"
          disabled={isPending}
          aria-disabled={isPending ? "true" : "false"}
        >
          {isDeletingItem ? <IconLoading /> : <IconTrashCan />}
        </Button>
      </div>
      <div className="inline-flex gap-1">
        <Button
          onClick={() => setItemQuantity((val) => val + 1)}
          variant={"outline"}
          size={"icon"}
          className="h-6 w-6"
          disabled={isPending}
          aria-disabled={isPending ? "true" : "false"}
        >
          &#43;
        </Button>
        <Input
          value={itemQuantity}
          onChange={(e) => void setItemQuantity(e.target.valueAsNumber)}
          className="w-16 h-6 p-2"
          type="number"
          disabled={isPending}
          aria-disabled={isPending ? "true" : "false"}
        />
        <Button
          onClick={() => setItemQuantity((val) => val - 1)}
          variant={"outline"}
          size={"icon"}
          className="h-6 w-6"
          disabled={isPending}
          aria-disabled={isPending ? "true" : "false"}
        >
          &#45;
        </Button>
      </div>
    </div>
  );
}
