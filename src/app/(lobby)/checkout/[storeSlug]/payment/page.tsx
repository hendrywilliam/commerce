import Stripe from "stripe";
import { db } from "@/db/core";
import { inArray } from "drizzle-orm";
import { stripe } from "@/lib/stripe";
import { Product, products } from "@/db/schema";
import { redirect } from "next/navigation";
import { OmitAndExtend, Extends } from "@/lib/utils";
import PageLayout from "@/components/layouts/page-layout";
import type { CartItem, PaymentIntentMetadata } from "@/types";
import { Checkout } from "@/components/lobby/checkout/checkout";
import OrderDetails from "@/components/lobby/checkout/order-details";

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const clientSecret = searchParams.client_secret;
  const paymentIntentId = searchParams.payment_intent_id;

  if (!paymentIntentId && !clientSecret) {
    redirect("/");
  }

  const paymentIntentMetadata = (await stripe.paymentIntents.retrieve(
    paymentIntentId,
  )) as unknown as OmitAndExtend<
    Stripe.PaymentIntent,
    "metadata",
    PaymentIntentMetadata
  >;

  const checkoutItem = JSON.parse(
    paymentIntentMetadata.metadata.checkoutItem as string,
  ) as CartItem[];

  const detailedOrders = (await db
    .select()
    .from(products)
    .where(
      inArray(
        products.id,
        checkoutItem.map((item) => item.id),
      ),
    )
    .execute()
    .then((products) => {
      return products.map((product) => {
        const qty = checkoutItem.find((item) => item.id === product.id)?.qty;
        return {
          ...product,
          qty: qty ?? 0,
        };
      });
    })) as Extends<Product, { qty: number }>[];

  return (
    <PageLayout>
      <h1 className="font-semibold text-2xl">Checkout</h1>
      <section className="flex flex-col lg:flex-row gap-4">
        <div className="w-2/3">
          <Checkout clientSecret={clientSecret} />
        </div>
        <div className="w-1/3 h-max">
          <h1 className="font-semibold text-2xl">
            Order Details ({detailedOrders.length})
          </h1>
          <div className="border rounded p-4 mt-2 shadow-sm">
            <OrderDetails orderItems={detailedOrders} />
            <p></p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
