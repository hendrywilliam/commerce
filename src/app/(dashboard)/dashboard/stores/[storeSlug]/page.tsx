import { getOwnedStoreFetcher } from "@/fetchers/stores/get-owned-store";
import StoreActionPanel from "@/components/dashboard/stores/store-action-panel";

export default async function DashboardDynamicStorePage({
  params,
}: {
  params: { storeSlug: string };
}) {
  const { store, payment } = await getOwnedStoreFetcher({
    slug: params.storeSlug,
  });

  return (
    <div className="mb-6 mt-4">
      <div className="grid grid-cols-2">
        <div className="">
          <p>{store.name}</p>
        </div>
        <StoreActionPanel store={store} payment={payment} />
      </div>
    </div>
  );
}
