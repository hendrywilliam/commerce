"use client";

import Link from "next/link";
import { slugify, truncate } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import { IconCart } from "@/components/ui/icons";
import type { CartLineDetailedItems } from "@/types";
import { buttonVariants } from "@/components/ui/button";

interface CartPanelProps {
  products: Record<"storeName", CartLineDetailedItems[]>;
}

export default function CartPanel({ products }: CartPanelProps) {
  return (
    <div className="w-full border p-4 rounded">
      <h1 className="font-semibold text-2xl">Checkout</h1>
      <div className="flex flex-col gap-2 mt-2">
        {Object.entries(products).map(([storeName, items], i) => (
          <div key={i} className="flex flex-col gap-2">
            <h1 className="font-semibold">{storeName}</h1>
            <p>
              Total Payment:{" "}
              {formatCurrency(
                items.reduce((total, item) => {
                  return total + Number(item.price);
                }, 0),
              )}
            </p>
            <Link
              href={`/checkout/${items[0].storeId}/${slugify(
                items[0].storeName,
              )}`}
              className={buttonVariants({
                variant: "outline",
                class: "inline-flex gap-2",
              })}
            >
              <IconCart />
              Checkout from {truncate(storeName, 10)}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
