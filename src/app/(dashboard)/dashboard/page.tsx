import CreateNewStoreForm from "@/components/forms/create-new-store-form";
import { getAllStores } from "@/actions/stores/get-all-stores";

export default async function DashboardPage() {
  const stores = await getAllStores();
  return (
    <div className="h-full w-full">
      <div className="w-64">
        <CreateNewStoreForm />
        {stores.map((store) => {
          return <p key={store.id}>{store.storeName}</p>;
        })}
      </div>
    </div>
  );
}
