import Image from "next/image";
import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import type { UploadData } from "@/types";
import { notFound } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Product, addresses, orders } from "@/db/schema";
import { beautifyId, parse_to_json, Extends } from "@/lib/utils";

interface StoreOrderDynamicPage {
  params: {
    orderId: string;
    [key: string]: string;
  };
}

export default async function StoreOrderDynamicPage({
  params,
}: StoreOrderDynamicPage) {
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, Number(params.orderId)),
  });

  if (!order) {
    notFound();
  }

  const shipmentAddress = await db.query.addresses.findFirst({
    where: eq(addresses.id, Number(order.addressId)),
  });

  const orderItems = parse_to_json<Extends<Product, { qty: number }>[]>(
    order.items as string,
  );

  return (
    <div className="w-full">
      <h1 className="font-bold text-2xl">Order Detailed Information</h1>
      <p className="text-gray-500">
        Information about the order, including shipment address, order items.
      </p>
      <Separator />
      <section>
        <div className="flex flex-col space-y-4">
          <div>
            <p className="text-gray-500">Order ID</p>
            <p>{beautifyId(order.stripePaymentIntentId ?? "")}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Customer Name</p>
            <p>{order.name}</p>
          </div>
          <div>
            <p className="text-gray-500">Customer Email</p>
            <p>{order.email}</p>
          </div>
          <div>
            <p className="text-gray-500">Payment Status</p>
            <p>{order.stripePaymentIntentStatus}</p>
          </div>
          {shipmentAddress && (
            <div>
              <p className="text-gray-500">Shipment Address</p>
              <p>{shipmentAddress.city}</p>
              <p>{shipmentAddress.country}</p>
              <p>{shipmentAddress.postal_code}</p>
              <p>{shipmentAddress.state}</p>
              <p>{shipmentAddress.line1}</p>
              <p>{shipmentAddress.line2}</p>
            </div>
          )}
          <div>
            <p className="text-gray-500">Order Items</p>
            {orderItems &&
              !!orderItems.length &&
              orderItems.map((orderItem) => {
                const orderItemImages = parse_to_json<UploadData[]>(
                  orderItem.image as string,
                );
                return (
                  <div key={orderItem.id} className="mt-1">
                    <div className="inline-flex gap-2 h-20">
                      {orderItemImages && !!orderItemImages.length && (
                        <div className="relative w-20 h-full border rounded">
                          <Image
                            src={orderItemImages[0].url}
                            fill
                            alt={orderItem.name ?? "Product Image"}
                            className="object-cover rounded"
                          />
                        </div>
                      )}
                      <div className="flex flex-col h-full justify-center">
                        <p>{orderItem.name}</p>
                        <p className="text-sm">{`${formatCurrency(
                          Number(orderItem.price),
                        )} x ${orderItem.qty} — ${formatCurrency(
                          Number(orderItem.price) * orderItem.qty,
                        )}`}</p>
                        <p className="text-sm">Stock: {orderItem.stock}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          <div>
            <p className="text-gray-500">Total Charge</p>
            <p>
              {formatCurrency(
                orderItems.reduce((total, orderItem) => {
                  return total + Number(orderItem.price) * orderItem.qty;
                }, 0),
              )}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
