import { db } from "@/db/core";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { inArray } from "drizzle-orm";
import { notFound } from "next/navigation";
import { OmitAndExtend } from "@/lib/utils";
import { Extends, beautifyId } from "@/lib/utils";
import { type Product, products } from "@/db/schema";
import PageLayout from "@/components/layouts/page-layout";
import type { CartItem, PaymentIntentMetadata } from "@/types";
import OrderStatus from "@/components/lobby/checkout/order-status";
import OrderDetails from "@/components/lobby/checkout/order-details";

export default async function OrderStatusPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string };
}) {
  // {payment_intent, payment_intent_client_secret, redirect_status}
  const paymentIntentId = searchParams["payment_intent"];

  if (!paymentIntentId) {
    notFound();
  }

  const currentOrder = (await stripe.paymentIntents.retrieve(
    paymentIntentId,
  )) as unknown as OmitAndExtend<
    Stripe.PaymentIntent,
    "metadata",
    PaymentIntentMetadata
  >;

  const checkoutItems = JSON.parse(
    currentOrder.metadata.checkoutItem,
  ) as CartItem[];
  const checkoutItemsId = checkoutItems.map((item) => item.id);

  const allCheckoutItems = (await db
    .select()
    .from(products)
    .where(inArray(products.id, checkoutItemsId))
    .execute()
    .then((products) => {
      return products.map((product) => {
        const qty = checkoutItems.find((item) => item.id === product.id)?.qty;
        return {
          ...product,
          qty,
        };
      });
    })) as unknown as Extends<Product, { qty: number }>[];

  return (
    <PageLayout>
      <div className="flex flex-col">
        <h1 className="font-semibold text-2xl">Order Status</h1>
        <p className="font-medium">Order ID: {beautifyId(currentOrder.id)}</p>
      </div>
      {!!currentOrder.status && (
        <OrderStatus orderStatus={currentOrder.status} />
      )}
      {!!allCheckoutItems.length && (
        <div className="w-full lg:w-1/2 p-4 border rounded">
          <h1 className="font-semibold text-2xl mb-4">Your order(s)</h1>
          <OrderDetails orderItems={allCheckoutItems} />
        </div>
      )}
      {!!currentOrder.shipping?.address && (
        <div className="border rounded w-full lg:w-1/2 p-4">
          <h1 className="font-semibold text-2xl">Shipment</h1>
          <p className="flex flex-col">
            {Object.entries(currentOrder?.shipping?.address).map(
              ([key, value]) => (
                <span key={key}>{value}</span>
              ),
            )}
          </p>
        </div>
      )}
    </PageLayout>
  );
}
