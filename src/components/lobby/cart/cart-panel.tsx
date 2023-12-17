"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { catchError, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { CartLineDetailedItems } from "@/types";
import { IconLoading, LockIcon } from "@/components/ui/icons";
import { createPaymentIntentAction } from "@/actions/stripe/create-payment-intent";

interface CartPanelProps {
  products: Record<"storeName", CartLineDetailedItems[]>;
}

export default function CartPanel({ products }: CartPanelProps) {
  const [isPending, startTransition] = useTransition();
  const { push } = useRouter();

  return (
    <div className="w-full border p-4 rounded">
      <h1 className="font-semibold text-2xl">Checkout</h1>
      <div className="flex flex-col gap-2 mt-2">
        {Object.entries(products).map(([storeName, items], i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="flex flex-col">
              <h1 className="font-semibold">{storeName}</h1>
              <p>
                Total Payment:{" "}
                {formatCurrency(
                  items.reduce((total, item) => {
                    return total + Number(item.price) * item.qty;
                  }, 0),
                )}
              </p>
            </div>
            <Button
              disabled={isPending}
              aria-disabled={isPending ? "true" : "false"}
              onClick={(e) =>
                startTransition(async () => {
                  try {
                    const paymentIntent = await createPaymentIntentAction({
                      storeId: items[0].storeId,
                      cartItem: items,
                    });

                    const storeSlug = items[0].storeSlug;

                    push(
                      `/checkout/${storeSlug}/payment?payment_intent_id=${paymentIntent.paymentIntentId}&client_secret=${paymentIntent.clientSecret}`,
                    );
                  } catch (error) {
                    catchError(error);
                  }
                })
              }
              className="flex gap-2"
            >
              {isPending ? <IconLoading /> : <LockIcon />}
              <span className="text-xs">Checkout from {storeName} </span>
            </Button>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <p className="text-xs">
          Worry less! Ecremmoce is not storing your data including: Card
          Information/Payment Information, Address.
        </p>
      </div>
    </div>
  );
}
