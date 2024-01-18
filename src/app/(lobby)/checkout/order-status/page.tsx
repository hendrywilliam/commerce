import { db } from "@/db/core";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { inArray } from "drizzle-orm";
import { notFound } from "next/navigation";
import { OmitAndExtend } from "@/lib/utils";
import { Extends, beautifyId } from "@/lib/utils";
import { type Product, products } from "@/db/schema";
import { Separator } from "@/components/ui/separator";
import PageLayout from "@/components/layouts/page-layout";
import type { CartItem, PaymentIntentMetadata } from "@/types";
import OrderStatus from "@/components/lobby/checkout/order-status";
import OrderDetails from "@/components/lobby/checkout/order-details";

export default async function OrderStatusPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: {
    payment_intent: string;
    payment_intent_client_secret: string;
    redirect_status: string;
    [key: string]: string;
  };
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
      <div className="flex flex-col items-center text-center">
        <h1 className="font-semibold text-2xl">Order Status</h1>
        <p>
          Order ID:{" "}
          <span className="font-medium">{beautifyId(currentOrder.id)}</span>
        </p>
      </div>
      {!!currentOrder.status && (
        <OrderStatus orderStatus={currentOrder.status} />
      )}
      {!!allCheckoutItems.length && (
        <div className="flex w-full p-4 rounded justify-center">
          <div className="flex flex-col w-full lg:w-1/2 items-center">
            <p className="font-medium mb-4">Order Information</p>
            <OrderDetails orderItems={allCheckoutItems} />
          </div>
        </div>
      )}
      {!!currentOrder.shipping?.address && (
        <div className="w-full flex justify-center">
          <div className="w-full lg:w-1/2 p-4">
            <Separator />
            <div className="w-full text-center">
              <p className="font-medium">Shipment Address</p>
              <p>
                Your order will be delivered to this address. Wrong address?
                Please contact the store.
              </p>
            </div>
            <p className="flex flex-col mt-4">
              {Object.entries(currentOrder?.shipping?.address).map(
                ([key, value]) => (
                  <span key={key}>{value}</span>
                ),
              )}
            </p>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
