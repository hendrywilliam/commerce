import { Separator } from "@/components/ui/separator";
import CreateNewStoreForm from "@/components/dashboard/stores/create-new-store-form";

export default function DashboardNewStorePage() {
  return (
    <div>
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold">New Store</h1>
        <p className="text-gray-500">Create your brand new store.</p>
      </div>
      <Separator />
      <div className="w-1/3">
        <CreateNewStoreForm />
      </div>
    </div>
  );
}
