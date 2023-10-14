import CreateNewStoreForm from "@/components/forms/create-new-store-form";
import { getAllStores } from "@/actions/stores/get-all-stores";

export default async function DashboardPage() {
  return (
    <div className="h-full w-full">
      <div className="w-64">
        <CreateNewStoreForm />
      </div>
    </div>
  );
}
