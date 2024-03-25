import Image from "next/image";
import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { addresses, orders } from "@/db/schema";
import { beautifyId } from "@/lib/utils";

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

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold">Order Detailed Information</h1>
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
            {order.items &&
              order.items.length > 0 &&
              order.items.map((item) => {
                return (
                  <div key={item.id} className="mt-1">
                    <div className="inline-flex h-20 gap-2">
                      {item.image && !!item.image.length && (
                        <div className="relative h-full w-20 rounded border">
                          <Image
                            src={item.image[0].url}
                            fill
                            alt={item.name ?? "Product Image"}
                            className="rounded object-cover"
                          />
                        </div>
                      )}
                      <div className="flex h-full flex-col justify-center">
                        <p>{item.name}</p>
                        <p className="text-sm">{`${formatCurrency(
                          Number(item.price),
                        )} x ${item.qty} — ${formatCurrency(
                          Number(item.price) * item.qty,
                        )}`}</p>
                        <p className="text-sm">Stock: {item.stock}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          <div>
            <p className="text-gray-500">Total Charge</p>
            {order.items.length > 0 && (
              <p>
                {formatCurrency(
                  order.items.reduce((total, orderItem) => {
                    return total + Number(orderItem.price) * orderItem.qty;
                  }, 0),
                )}
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
