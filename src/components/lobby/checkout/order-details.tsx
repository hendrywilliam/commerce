import Image from "next/image";
import { Product } from "@/db/schema";
import type { UploadData } from "@/types";
import { Separator } from "@/components/ui/separator";
import ImagePlaceholder from "@/components/image-placeholder";
import { formatCurrency, type Extends, parse_to_json } from "@/lib/utils";

export default function OrderDetails({
  orderItems,
}: {
  orderItems: Extends<Product, { qty: number }>[];
}) {
  const totalOrderPrice = orderItems.reduce((total, item) => {
    return total + Number(item.price) * item.qty;
  }, 0);

  return (
    <div className="w-full h-max">
      {orderItems.map((item) => {
        const parsedImage = parse_to_json<UploadData[]>(item.image as string)[0]
          .url;
        return (
          <div key={item.id} className="inline-flex justify-between w-full">
            <div className="inline-flex gap-2">
              <div className="relative w-12 h-12">
                {parsedImage ? (
                  <Image
                    src={parsedImage}
                    alt={item.name ?? "Product Image"}
                    className="object-cover rounded"
                    fill
                  />
                ) : (
                  <ImagePlaceholder />
                )}
              </div>
              <div className="flex flex-col my-auto">
                <p className="font-medium">{item.name}</p>
                <p>Quantity: {item.qty}</p>
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
      <div className="flex flex-col w-full">
        <div className="flex w-full justify-between my-1">
          <p>Price</p>
          <p className="font-medium">{formatCurrency(totalOrderPrice)}</p>
        </div>
        <div className="flex w-full justify-between my-1">
          <p>Shipping</p>
          <p className="font-medium">FREE</p>
        </div>
        <div className="flex w-full justify-between my-1">
          <p>TAX</p>
          <p className="font-medium">0%</p>
        </div>
      </div>
    </div>
  );
}
