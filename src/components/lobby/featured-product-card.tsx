"use client";

import { Product } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { IconCart, IconLoading, IconView } from "@/components/ui/icons";
import { AddItemInCartAction } from "@/actions/carts/add-item-in-cart";
import { toast } from "sonner";
import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

type FeaturedProductCardProps = {
  product: Omit<Product, "createdAt">;
};

export default function FeaturedProductCard({
  product,
}: FeaturedProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function addToCart() {
    setIsLoading((val) => !val);
    await AddItemInCartAction({ id: product.id, qty: 1 })
      .then((res) => {
        toast.success("Success add item to cart.");
      })
      .finally(() => {
        setIsLoading((val) => !val);
      });
  }

  const parsedImageUrl = JSON.parse(product.image as string)[0].fileUrl;

  return (
    <div className="relative h-80 w-full border rounded">
      <div className="absolute z-[2] top-2 right-2 rounded px-2 py-1 bg-foreground text-white font-semibold">
        <p className="text-xs">{formatCurrency(Number(product.price))}</p>
      </div>
      <div className="relative h-4/6">
        <Image
          src={parsedImageUrl}
          fill
          alt={product.name as string}
          className="object-cover rounded-t"
        />
      </div>
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
            href={`/product/${product.id}`}
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
