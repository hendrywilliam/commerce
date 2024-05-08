import StoreForm from "@/components/dashboard/stores/store-form";

export default function NewStorePage() {
  return (
    <div className="w-full">
      <StoreForm storeStatus="new-store" />
    </div>
  );
}
