import Image from "next/image";
import { Product } from "@/db/schema";
import type { UploadData } from "@/types";
import { Separator } from "@/components/ui/separator";
import ImagePlaceholder from "@/components/image-placeholder";
import { formatCurrency, type Extends } from "@/lib/utils";

export default function OrderDetails({
  orderItems,
}: {
  orderItems: Extends<Product, { qty: number }>[];
}) {
  const totalOrderPrice = orderItems.reduce((total, item) => {
    return total + Number(item.price) * item.qty;
  }, 0);

  return (
    <div className="h-max w-full">
      {orderItems.length > 0 &&
        orderItems.map((item) => {
          return (
            <div key={item.id} className="inline-flex w-full justify-between">
              <div className="inline-flex gap-2">
                <div className="relative h-12 w-12">
                  {item.image[0].url ? (
                    <Image
                      src={item.image[0].url}
                      alt={item.name ?? "Product Image"}
                      className="rounded object-cover"
                      fill
                    />
                  ) : (
                    <ImagePlaceholder />
                  )}
                </div>
                <div className="my-auto flex flex-col">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty - {item.qty}</p>
                </div>
              </div>
              <div className="flex items-center">
                <p>
                  <span className="text-xl">
                    {formatCurrency(item.qty * Number(item.price))}
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      <Separator />
      <div className="flex w-full flex-col space-y-1">
        <div className="flex w-full justify-between">
          <p>Price</p>
          <p className="font-medium">{formatCurrency(totalOrderPrice)}</p>
        </div>
        <div className="flex w-full justify-between">
          <p>Shipping</p>
          <p className="font-medium">FREE</p>
        </div>
        <div className="flex w-full justify-between">
          <p>Tax</p>
          <p className="font-medium">0%</p>
        </div>
      </div>
    </div>
  );
}
