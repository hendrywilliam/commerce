"use client";

import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useState } from "react";
import { Product } from "@/db/schema";
import type { UploadData } from "@/types";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import ImagePlaceholder from "@/components/image-placeholder";
import { addItemInCartAction } from "@/actions/carts/add-item-in-cart";
import { catchError, formatCurrency, parseToJson } from "@/lib/utils";
import { IconCart, IconLoading, IconView } from "@/components/ui/icons";

type ProductCardProps = {
  product: Omit<Product, "createdAt">;
};

export default function ProductCard({ product }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function addToCart() {
    setIsLoading((isLoading) => !isLoading);
    toast.promise(addItemInCartAction({ id: product.id, qty: 1 }), {
      loading: `Adding ${product.name} to your cart...`,
      success: () => `${product.name} has been added to your cart`,
      error: (error) => catchError(error),
      finally: () => setIsLoading((isLoading) => !isLoading),
    });
  }

  const parsedImage = parseToJson<UploadData[]>(product.image as string)[0].url;

  return (
    <div className="group relative h-80 w-full rounded border shadow">
      <div className="absolute right-2 top-2 z-[2] rounded bg-foreground px-2 py-1 font-semibold text-background">
        <p className="text-xs">{formatCurrency(Number(product.price))}</p>
      </div>
      <Link href={`/products/${product.slug}`}>
        <div className="relative h-4/6 overflow-hidden rounded">
          {parsedImage ? (
            <Image
              src={parsedImage}
              fill
              sizes="100vw"
              alt={product.name}
              className="h-full w-full rounded-t object-cover transition duration-300 ease-in-out group-hover:scale-105"
            />
          ) : (
            <ImagePlaceholder />
          )}
        </div>
      </Link>
      <div className="h-2/6 border-t p-2 ">
        <p className="font-semibold">{product.name}</p>
        <p className="truncate text-sm text-gray-400">{product.description}</p>
        <div className="mt-2 inline-flex w-full justify-between gap-2">
          <Link
            className={buttonVariants({
              size: "sm",
              variant: "outline",
            })}
            href={`/quickview-product/${product.slug}`}
          >
            <IconView />
          </Link>
          {product.stock > 0 ? (
            <Button
              onClick={addToCart}
              size="sm"
              className="inline-flex w-full gap-1"
              disabled={isLoading}
            >
              {isLoading ? <IconLoading /> : <IconCart />}
              Add to cart
            </Button>
          ) : (
            <Button size="sm" className="inline-flex w-full gap-1" disabled>
              Out of stock
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
