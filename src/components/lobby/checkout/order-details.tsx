import Image from "next/image";
import { Product } from "@/db/schema";
import type { UploadData } from "@/types";
import ImagePlaceholder from "@/components/image-placeholder";
import { formatCurrency, type Extends, parse_to_json } from "@/lib/utils";

export default function OrderDetails({
  orderItems,
}: {
  orderItems: Extends<Product, { qty: number }>[];
}) {
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
    </div>
  );
}
