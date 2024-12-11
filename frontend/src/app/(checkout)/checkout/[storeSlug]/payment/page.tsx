import { db } from "@/db/core";
import { eq, inArray } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Extends } from "@/lib/utils";
import { Product, products, stores } from "@/db/schema";
import PageLayout from "@/components/layouts/page-layout";
import type { CartItem } from "@/types";
import { Checkout } from "@/components/lobby/checkout/checkout";
import OrderDetails from "@/components/lobby/checkout/order-details";
import { get_payment_intent_fetcher } from "@/fetchers/stripe/get-payment-intent";
import { hasConnectedStripeAccount } from "@/actions/stripe/check-connected-account";
import { updateStripeAccountStatusAction } from "@/actions/stripe/update-stripe-account-status";

export default async function PaymentPage({
  params,
  searchParams,
}: {
  params: { storeSlug: string };
  searchParams: {
    client_secret: string;
    payment_intent_id: string;
    [key: string]: string;
  };
}) {
  const clientSecret = searchParams.client_secret;
  const paymentIntentId = searchParams.payment_intent_id;

  if (!paymentIntentId && !clientSecret) {
    notFound();
  }

  const getCurrentStore = await db.query.stores.findFirst({
    where: eq(stores.slug, params.storeSlug),
  });

  if (!getCurrentStore) {
    notFound();
  }

  const currentStoreId = getCurrentStore.id;

  await updateStripeAccountStatusAction(currentStoreId);

  const hasConnectedAccount = await hasConnectedStripeAccount(currentStoreId);

  const paymentIntent = await get_payment_intent_fetcher(paymentIntentId);

  const checkoutItem = paymentIntent
    ? (JSON.parse(paymentIntent.metadata.checkoutItem as string) as CartItem[])
    : [];

  const detailedOrders =
    checkoutItem.length > 0
      ? ((await db
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
              const qty = checkoutItem.find((item) => item.id === product.id)
                ?.qty;
              return {
                ...product,
                qty: qty ?? 0,
              };
            });
          })) as Extends<Product, { qty: number }>[])
      : [];

  return (
    <PageLayout>
      <h1 className="text-2xl font-semibold">Checkout</h1>
      {hasConnectedAccount ? (
        <section className="flex flex-col gap-4 lg:flex-row">
          <div className="w-2/3">
            <Checkout clientSecret={clientSecret} />
          </div>
          <div className="h-max w-1/3">
            <h1 className="text-2xl font-semibold">
              Order Details ({detailedOrders.length})
            </h1>
            <div className="mt-2 rounded border p-4 shadow-sm">
              <OrderDetails orderItems={detailedOrders} />
            </div>
          </div>
        </section>
      ) : (
        <section className="flex flex-col gap-4 lg:flex-row">
          <p>
            This store is not accepting any kind of payment. Please contact the
            store to confirm your order.
          </p>
        </section>
      )}
    </PageLayout>
  );
}
