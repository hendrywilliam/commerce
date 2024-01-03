import { db } from "@/db/core";
import { stores } from "@/db/schema";
import StoreCard from "@/components/lobby/store-card";
import PageLayout from "@/components/layouts/page-layout";

export default async function StoresPage() {
  const allStores = await db.select().from(stores);

  return (
    <PageLayout>
      <h1 className="font-bold text-xl">Browse All Stores</h1>
      <div className="grid grid-cols-4 gap-4">
        {!!allStores.length &&
          allStores.map((store) => <StoreCard key={store.id} store={store} />)}
      </div>
    </PageLayout>
  );
}
