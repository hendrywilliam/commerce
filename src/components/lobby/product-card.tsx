"use client";

import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useState } from "react";
import { Product } from "@/db/schema";
import type { ProductImage } from "@/types";
import { Button } from "@/components/ui/button";
import { formatCurrency, slugify } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import ImagePlaceholder from "@/components/image-placeholder";
import { addItemInCartAction } from "@/actions/carts/add-item-in-cart";
import { IconCart, IconLoading, IconView } from "@/components/ui/icons";

type ProductCardProps = {
  product: Omit<Product, "createdAt">;
};

export default function ProductCard({ product }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function addToCart() {
    setIsLoading((val) => !val);
    await addItemInCartAction({ id: product.id, qty: 1 })
      .then(() => {
        toast.success("Item added to your cart.");
      })
      .finally(() => {
        setIsLoading((val) => !val);
      });
  }

  const parsedImageUrl = (
    JSON.parse(product.image as string) as ProductImage[]
  )[0]?.url;

  return (
    <div className="group relative h-80 w-full cursor">
      <div className="absolute z-[2] top-2 right-2 rounded px-2 py-1 bg-foreground text-white font-semibold">
        <p className="text-xs">{formatCurrency(Number(product.price))}</p>
      </div>
      <Link href={`/product/${product.id}/${slugify(product.name as string)}`}>
        <div className="relative rounded h-4/6 overflow-hidden">
          {parsedImageUrl ? (
            <Image
              src={parsedImageUrl}
              fill
              sizes="100vw"
              alt={product.name as string}
              className="w-full h-full object-cover rounded-t transition duration-300 ease-in-out group-hover:scale-105"
            />
          ) : (
            <ImagePlaceholder />
          )}
        </div>
      </Link>
      <div className="h-2/6 border-t p-2">
        <p className="font-semibold">{product.name}</p>
        <p className="text-sm text-gray-400 truncate">{product.description}</p>
        <div className="inline-flex w-full gap-2 justify-between mt-2">
          <Link
            className={buttonVariants({
              size: "sm",
              variant: "outline",
              class: "w-full inline-flex gap-1",
            })}
            href={`/quickview-product/${product.id}`}
          >
            <IconView />
            Quick View
          </Link>
          <Button
            onClick={addToCart}
            size={"sm"}
            className="inline-flex w-full gap-1"
            disabled={isLoading}
          >
            {isLoading ? <IconLoading /> : <IconCart />}
            Add to cart
          </Button>
        </div>
      </div>
    </div>
  );
}
