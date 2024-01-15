import Link from "next/link";
import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { stripe } from "@/lib/stripe";
import { notFound } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { payments, stores } from "@/db/schema";
import { WarningIcon } from "@/components/ui/icons";
import { buttonVariants } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { get_store_product_fetcher } from "@/fetchers/products/get-store-products";
import DashboardStoreTabs from "@/components/dashboard/stores/dashboard-store-tabs";

export default async function DashboardDynamicStorePage({
  params,
  searchParams,
}: {
  params: { storeSlug: string };
  searchParams: { tab: string };
}) {
  const store = await db.query.stores.findFirst({
    where: eq(stores.slug, params.storeSlug),
  });

  if (!store) {
    notFound();
  }

  const storeProductData = await get_store_product_fetcher(params.storeSlug);

  // Get payment record
  const storePayment = await db.query.payments.findFirst({
    where: eq(payments.storeId, store.id),
  });

  // Available balance meaning the funds can be paid out now.
  let availableBalance;
  // Pending balance meaning the funds are not yet available to pay out.
  let pendingBalance;

  if (storePayment) {
    const allBalance = await stripe.balance.retrieve({
      stripeAccount: storePayment.stripeAccountId,
    });

    availableBalance = allBalance.available.reduce(
      (total, availableBalance) => total + availableBalance.amount,
      0,
    );

    pendingBalance = allBalance.pending.reduce(
      (total, pendingBalance) => total + pendingBalance.amount,
      0,
    );
  } else {
    // Set default to 0
    availableBalance = 0;
    pendingBalance = 0;
  }

  return (
    <div>
      <div className="h-1/2 w-full">
        {!store.active && (
          <div className="mb-4">
            <Alert
              variant="default"
              className="border-yellow-400 bg-yellow-400/10"
            >
              <WarningIcon className="w-4 h-4" />
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>
                In order to start accepting payments, you have to{" "}
                <span className="font-semibold">activate</span> your store
                first.
              </AlertDescription>
            </Alert>
          </div>
        )}
        <div className="w-full inline-flex border-b pb-4">
          <div className="w-full">
            <h1 className="font-bold text-2xl w-[75%]">{store.name}</h1>
            <p>
              Store Balance:{" "}
              <span className="font-medium">
                {formatCurrency(availableBalance)}
              </span>
            </p>
            {!!pendingBalance && (
              <p>
                You have{" "}
                <span className="text-destructive font-medium">
                  {formatCurrency(pendingBalance)}
                </span>{" "}
                pending balance, make sure to complete the onboarding process.
              </p>
            )}
            <p className="w-[75%]">Your current store information lies here.</p>
          </div>
          <div className="flex-1">
            <Link
              href={`${params.storeSlug}/add-new-product`}
              className={buttonVariants({ class: "w-max" })}
            >
              Add product
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <DashboardStoreTabs
          searchParamsTab={searchParams.tab}
          store={store}
          storeProductData={storeProductData}
        />
      </div>
    </div>
  );
}
