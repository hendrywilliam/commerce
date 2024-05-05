import Link from "next/link";
import { centsToDollars } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/components/ui/button";
import StoreForm from "@/components/dashboard/stores/store-form";
import { WarningIcon, ArrowOutwardIcon } from "@/components/ui/icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ActivateStoreButton from "@/components/dashboard/stores/activate-store-button";
import StorefrontDangerZone from "@/components/dashboard/stores/store-front-danger-zone";
import { getOwnedStoreFetcher } from "@/fetchers/stores/get-owned-store";

export default async function DashboardDynamicStorePage({
  params,
}: {
  params: { storeSlug: string };
}) {
  const { ordersCount, productsCount, storeBalance, store } =
    await getOwnedStoreFetcher({
      slug: params.storeSlug,
    });

  return (
    <div className="mb-6 mt-4">
      <div className="w-full">
        {!store.active && (
          <div className="mb-4">
            <Alert
              variant="default"
              className="border-yellow-400 bg-yellow-400/10"
            >
              <WarningIcon className="h-4 w-4" />
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>
                In order to start accepting payments, you have to{" "}
                <span className="font-semibold">activate</span> your store
                first.
              </AlertDescription>
            </Alert>
          </div>
        )}
        <div className="inline-flex w-full">
          <div className="w-full">
            <h1 className="text-2xl font-bold">General</h1>
            <p className="text-gray-500">
              Public store information. Your users can see this information.
            </p>
          </div>
        </div>
      </div>
      <Separator />
      <div className="mt-6 space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6 xl:grid-cols-4">
          <div className="flex flex-col rounded border p-4">
            <div>
              <p className="text-sm text-gray-400">Store Balance</p>
              <p className="mt-2 text-4xl font-bold">
                ${centsToDollars(storeBalance.availableBalance)}
              </p>
            </div>
            <div className="mt-2 inline-flex items-center justify-between">
              <p className="text-sm text-gray-400">
                Activate store to accept payment.
              </p>
              <ActivateStoreButton storeId={store.id} isActive={store.active} />
            </div>
          </div>
          <div className="flex flex-col rounded border p-4">
            <div>
              <p className="text-sm text-gray-400">Total Products</p>
              <p className="mt-2 text-4xl font-bold">
                {productsCount[0].count}
              </p>
            </div>
            <div className="mt-2 inline-flex items-center justify-between">
              <p className="text-sm text-gray-400">Add or edit your product.</p>
              <Link
                href={`${store.slug}/products`}
                className={buttonVariants({
                  variant: "outline",
                  class: "inline-flex gap-1",
                })}
              >
                Products
                <ArrowOutwardIcon />
              </Link>
            </div>
          </div>
          <div className="flex flex-col rounded border p-4">
            <div>
              <p className="text-sm text-gray-400">Total Orders</p>
              <p className="mt-2 text-4xl font-bold">{ordersCount[0].count}</p>
            </div>
            <div className="mt-2 inline-flex items-center justify-between">
              <p className="text-sm text-gray-400">
                Show the list of orders made in your store.
              </p>
              <Link
                href={`${store.slug}/orders`}
                className={buttonVariants({
                  variant: "outline",
                  class: "inline-flex gap-1",
                })}
              >
                Orders
                <ArrowOutwardIcon />
              </Link>
            </div>
          </div>
        </div>
        <StoreForm
          storeStatus="existing-store"
          initialValue={{
            id: store.id,
            name: store.name,
            description: store.description,
          }}
        />
        <StorefrontDangerZone storeId={store.id} />
      </div>
    </div>
  );
}
