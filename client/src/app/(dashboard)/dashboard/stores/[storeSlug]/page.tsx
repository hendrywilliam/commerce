import { getOwnedStoreFetcher } from "@/fetchers/stores/get-owned-store";
import StoreActionPanel from "@/components/dashboard/stores/store-action-panel";
import { formatCurrency } from "@/lib/utils";
import DashboardStoreProductShellTable from "@/components/dashboard/stores/store-product-shell-table";
import OrdersHistoryShellTable from "@/components/dashboard/stores/orders/orders-history-shell-table";

export default async function DashboardDynamicStorePage({
  params,
}: {
  params: { storeSlug: string };
}) {
  const { store, payment, storeBalance, products, orders } =
    await getOwnedStoreFetcher({
      slug: params.storeSlug,
    });

  return (
    <div className="mb-6 mt-4 flex flex-col">
      <div className="flex flex-col space-y-4">
        <div className="grid grid-cols-2">
          <h1 className="font-semibold">{store.name}</h1>
          <StoreActionPanel store={store} payment={payment} />
        </div>
        <div className="text-gray-500">
          {payment && payment.id ? (
            <dl className="grid w-full grid-flow-col gap-2 lg:w-1/2 [&>dd]:col-span-1 [&>dd]:font-semibold [&>dd]:text-black">
              <dt>Payment ID:</dt>
              <dd>#{payment.id}</dd>
              <dt>Balance:</dt>
              <dd>{formatCurrency(storeBalance.availableBalance)}</dd>
              <dt>Pending Balance:</dt>
              <dd>{formatCurrency(storeBalance.pendingBalance)}</dd>
            </dl>
          ) : (
            <p>No payment channel for this store.</p>
          )}
        </div>
      </div>
      <div className="mt-12 flex flex-col space-y-6">
        <h1 className="font-semibold">Store Overview</h1>
        <DashboardStoreProductShellTable
          storeProductData={products}
          showActionPanel={false}
        />
        <OrdersHistoryShellTable orders={orders} showActionPanel={false} />
      </div>
    </div>
  );
}
