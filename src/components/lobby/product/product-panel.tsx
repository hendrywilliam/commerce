"use client";

import {
  IconArrowDown,
  IconArrowUp,
  IconCart,
  IconLoading,
  IconStores,
} from "@/components/ui/icons";
import { toast } from "sonner";
import { useState } from "react";
import { catchError } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Product, Store } from "@/db/schema";
import { addItemInCartAction } from "@/actions/carts/add-item-in-cart";

interface ProductPanelProps {
  product: Product;
  store: Store;
}

export default function ProductPanel({ product, store }: ProductPanelProps) {
  const [productQuantity, setProductQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const subTotalProduct = productQuantity * Number(product.price);

  async function handleAddItemToCart() {
    setIsLoading((isLoading) => !isLoading);
    try {
      await addItemInCartAction({
        id: product.id,
        qty: productQuantity > product.stock ? product.stock : productQuantity,
      });
      toast.success("Success add item to cart.");
    } catch (err) {
      catchError(err);
    } finally {
      setIsLoading((isLoading) => !isLoading);
    }
  }

  return (
    <div className="flex flex-col w-full gap-4">
      <ul className="flex flex-col gap-2">
        <li className="inline-flex justify-between w-full ">
          <p className="text-gray-400">Store</p>
          <p className="font-semibold">{store.name}</p>
        </li>
        <li className="inline-flex justify-between w-full ">
          <p className="text-gray-400">Sub Total</p>
          <p className="font-semibold">{formatCurrency(subTotalProduct)}</p>
        </li>
        <li className="inline-flex justify-between w-full">
          <p className="text-gray-400">Stock</p>
          <p className="font-semibold">{product.stock}</p>
        </li>
      </ul>
      <div className="flex w-full gap-1">
        <Button
          onClick={() =>
            setProductQuantity((productQuantity) =>
              productQuantity > 0 ? productQuantity + 1 : 1
            )
          }
          variant={"outline"}
          size={"icon"}
          className="h-8 w-8"
        >
          <IconArrowUp />
        </Button>
        <Input
          value={productQuantity}
          onChange={(e) => setProductQuantity(Number(e.target.value))}
          min={1}
          type="number"
          className="h-8 w-16"
          max={product.stock}
        />
        <Button
          onClick={() =>
            setProductQuantity((productQuantity) =>
              productQuantity > 1 ? productQuantity - 1 : 1
            )
          }
          variant={"outline"}
          size={"icon"}
          className="h-8 w-8"
        >
          <IconArrowDown />
        </Button>
      </div>
      <div className="inline-flex w-full gap-2">
        <Button
          disabled={isLoading}
          aria-disabled={isLoading ? "true" : "false"}
          className="inline-flex gap-2"
          onClick={handleAddItemToCart}
        >
          {isLoading ? <IconLoading /> : <IconCart />}
          Add To Cart
        </Button>
        <Button className="inline-flex gap-2" variant={"outline"}>
          <IconStores />
          Visit Store
        </Button>
      </div>
    </div>
  );
}
