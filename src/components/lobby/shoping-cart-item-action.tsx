"use client";

import { CartItem } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconTrashCan, IconLoading } from "@/components/ui/icons";
import { useState, useEffect, useTransition } from "react";
import { deleteCartItemAction } from "@/actions/carts/delete-cart-item";
import { catchError } from "@/lib/utils";
import { toast } from "sonner";

interface ShoppingCartItemActionProps {
  productId: number;
  qty: number;
}

export default function ShoppingCartItemAction({
  productId,
  qty,
}: ShoppingCartItemActionProps) {
  const [itemQuantity, setItemQuantity] = useState(qty);
  const [isPending, startTransition] = useTransition();

  function handleIncreaseItemQuantity() {}

  async function handleDeleteItemFromCart() {
    startTransition(async () => {
      try {
        await deleteCartItemAction(productId);
        toast.success("Success delete the selected item.");
      } catch (err) {
        catchError(err);
      }
    });
  }

  useEffect(() => {}, [itemQuantity]);

  return (
    <div className="flex flex-col gap-2">
      <div className="w-full flex justify-end">
        <Button
          onClick={handleDeleteItemFromCart}
          variant={"outline"}
          size={"icon"}
          className="h-6 w-6"
        >
          {isPending ? <IconLoading /> : <IconTrashCan />}
        </Button>
      </div>
      <div className="inline-flex gap-1">
        <Button variant={"outline"} size={"icon"} className="h-6 w-6">
          &#43;
        </Button>
        <Input
          value={itemQuantity}
          onChange={(e) => void setItemQuantity(e.target.valueAsNumber)}
          className="w-16 h-6 p-2"
          type="number"
        />
        <Button variant={"outline"} size={"icon"} className="h-6 w-6">
          &#45;
        </Button>
      </div>
    </div>
  );
}
