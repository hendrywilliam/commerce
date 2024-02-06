import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { addresses, orders } from "@/db/schema";
import { beautifyId } from "@/lib/utils";
import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";

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
      <div className="w-full">
        <p className="text-gray-500">Order ID</p>
        <h1 className="font-bold text-2xl">
          #{beautifyId(order.stripePaymentIntentId!)}
        </h1>
      </div>
      <Separator />
      <section>
        <ul className="flex flex-col space-y-4">
          <li>
            <p className="text-sm text-gray-500">Customer Name</p>
            <p>{order.name}</p>
          </li>
          <li>
            <p className="text-sm text-gray-500">Customer Email</p>
            <p>{order.email}</p>
          </li>
          <li>
            <p className="text-sm text-gray-500">Payment Status</p>
            <p>{order.stripePaymentIntentStatus}</p>
          </li>
          {shipmentAddress && (
            <li>
              <p className="text-sm text-gray-500">Shipment Address</p>
              <p>{shipmentAddress.city}</p>
              <p>{shipmentAddress.country}</p>
              <p>{shipmentAddress.postal_code}</p>
              <p>{shipmentAddress.state}</p>
              <p>{shipmentAddress.line1}</p>
              <p>{shipmentAddress.line2}</p>
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}
