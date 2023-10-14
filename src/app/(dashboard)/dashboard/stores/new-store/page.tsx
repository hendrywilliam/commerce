import CreateNewStoreForm from "@/components/forms/create-new-store-form";

export default function DashboardNewStorePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Create New Store</h1>
      <div className="w-1/3">
        <CreateNewStoreForm />
      </div>
    </div>
  );
}
