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
import OrderDetails from "@/components/lobby/checkout/order-details";
import { get_payment_intent_fetcher } from "@/fetchers/purchase/get-payment-intent";

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
  const paymentIntentId = searchParams["payment_intent"];

  const currentOrder = await get_payment_intent_fetcher(paymentIntentId);

  const checkoutItems = JSON.parse(
    currentOrder!.metadata.checkoutItem,
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
      <div>
        <p className="text-sm text-gray-500">
          Order ID: {beautifyId(currentOrder!.id)}
        </p>
        <h1 className="text-2xl font-semibold">Payment Succeeded</h1>
      </div>
      {!!allCheckoutItems.length && (
        <div className="flex w-full rounded">
          <div className="flex w-full flex-col lg:w-1/2">
            <p className="mb-4 font-medium">Order Information</p>
            <OrderDetails orderItems={allCheckoutItems} />
          </div>
        </div>
      )}
      {!!currentOrder!.shipping?.address && (
        <div className="flex w-full">
          <div className="w-full lg:w-1/2">
            <Separator />
            <p className="font-medium">Shipment Address</p>
            <p className="mt-4 flex flex-col text-gray-500">
              {Object.entries(currentOrder!.shipping?.address).map(
                ([key, value]) => (
                  <span key={key}>{value}</span>
                ),
              )}
            </p>
            <Separator />
            <p className="font-medium">What`s next?</p>
            <p className="text-gray-500">
              Our team is preparing your order, Please be patient.
            </p>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
