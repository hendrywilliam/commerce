"use client";

import { Product } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { IconCart, IconLoading } from "@/components/ui/icons";
import { AddItemInCartAction } from "@/actions/carts/add-item-in-cart";
import { toast } from "sonner";
import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";

type FeaturedProductCardProps = {
  products: Omit<Product, "createdAt">;
};

export default function FeaturedProductCard({
  products,
}: FeaturedProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function addToCart() {
    setIsLoading((val) => !val);
    await AddItemInCartAction({ id: products.id, qty: 1 })
      .then((res) => {
        toast.success("Success add item to cart.");
      })
      .finally(() => {
        setIsLoading((val) => !val);
      });
  }

  const parsedImageUrl = JSON.parse(products.image as string)[0].fileUrl;

  return (
    <div className="relative h-80 w-full border rounded">
      <div className="absolute top-2 right-2 border rounded px-2 py-1 bg-foreground text-white font-semibold">
        <p className="text-xs">{formatCurrency(Number(products.price))}</p>
      </div>
      <div className="relative h-4/6">
        <Image
          src={parsedImageUrl}
          fill
          alt={products.name as string}
          className="object-cover rounded-t"
        />
      </div>
      <div className="h-2/6 border-t p-2">
        <p className="font-semibold">{products.name}</p>
        <p className="text-sm text-gray-400">{products.description}</p>
        <div className="inline-flex w-full gap-2 justify-between mt-2">
          <Button size={"sm"} variant={"outline"} className="w-full">
            View Product
          </Button>
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
