import Link from "next/link";
import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { stores } from "@/db/schema";
import { currentUser } from "@clerk/nextjs";
import { formatCurrency } from "@/lib/utils";
import type { UserObjectCustomized } from "@/types";
import { WarningIcon } from "@/components/ui/icons";
import { notFound, redirect } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { get_store_balance_fetcher } from "@/fetchers/stores/get-store-balance";
import { get_products_page_fetcher } from "@/fetchers/products/get-products-page";
import DashboardStoreTabs from "@/components/dashboard/stores/dashboard-store-tabs";
import { get_all_products_and_store_fetcher } from "@/fetchers/products/get-all-products-and-stores";

export default async function DashboardDynamicStorePage({
  params,
  searchParams,
}: {
  params: { storeSlug: string };
  searchParams: { tab: string; page: string; page_size: string };
}) {
  const page = isNaN(Number(searchParams.page)) ? 1 : Number(searchParams.page);
  const pageSize = isNaN(Number(searchParams.page_size))
    ? 10
    : Number(searchParams.page_size);

  const user = (await currentUser()) as unknown as UserObjectCustomized;

  const store = await db.query.stores.findFirst({
    where: eq(stores.slug, params.storeSlug),
  });

  if (!store) {
    notFound();
  }

  const storeOwned = user.privateMetadata.storeId.find(
    (storeId) => storeId === String(store.id),
  );

  if (!storeOwned) {
    redirect("/dashboard/stores");
  }

  const storeProductData = await get_all_products_and_store_fetcher({
    page,
    pageSize,
    sellers: params.storeSlug,
  }).then((storeProduct) => {
    return storeProduct.map((product) => {
      return product.products;
    });
  });

  const totalPage = await get_products_page_fetcher({
    pageSize,
    sellers: params.storeSlug,
  });

  const { availableBalance, pendingBalance } = await get_store_balance_fetcher(
    store.id,
  );

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
          currentPage={page}
          totalPage={totalPage}
        />
      </div>
    </div>
  );
}
