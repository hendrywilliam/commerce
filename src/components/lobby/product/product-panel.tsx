"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Product, Store } from "@/db/schema";
import { buttonVariants } from "@/components/ui/button";
import { catchError, formatCurrency } from "@/lib/utils";
import { IconCart, IconLoading, IconStores } from "@/components/ui/icons";
import { addItemInCartAction } from "@/actions/carts/add-item-in-cart";
import Rating from "@/components/rating";

interface ProductPanelProps {
  product: Product;
  store: Store;
}

export default function ProductPanel({ product, store }: ProductPanelProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function addItemToCart() {
    setIsLoading((isLoading) => !isLoading);

    toast.promise(
      addItemInCartAction({
        id: product.id,
        qty: 1,
      }),
      {
        loading: `Adding ${product.name} to your cart...`,
        success: `${product.name} has been added to your cart.`,
        error: (error) => catchError(error),
        finally: () => setIsLoading((isLoading) => !isLoading),
      },
    );
  }

  return (
    <div className="flex w-full flex-col gap-4 lg:mx-10">
      <div className="flex flex-col space-y-3">
        <p className="text-sm text-gray-400">{store.name}</p>
        <h1 className="text-3xl font-semibold">{product.name}</h1>
        <Rating
          isInteractable={false}
          rating={Math.floor(Number(product.averageRatings))}
        />
      </div>
      <h1 className="my-7 text-3xl font-semibold">
        {formatCurrency(Number(product.price))}
      </h1>
      <div className="flex flex-col space-y-3">
        <p className="whitespace-pre-wrap text-gray-500">
          {product.description}
        </p>
      </div>
      <div className="mt-4 inline-flex h-10 w-full gap-2">
        {product.stock > 0 ? (
          <Button
            disabled={isLoading}
            aria-disabled={isLoading ? "true" : "false"}
            className="inline-flex h-full w-full gap-2"
            onClick={addItemToCart}
            data-testid="add-to-cart-button"
          >
            {isLoading ? <IconLoading /> : <IconCart />}
            Add To Cart
          </Button>
        ) : (
          <Button disabled className="inline-flex gap-2">
            Out of Stock
          </Button>
        )}
        <Link
          href={`/store/${store.slug}`}
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            class: "inline-flex h-full gap-2",
          })}
        >
          <IconStores />
        </Link>
      </div>
    </div>
  );
}
