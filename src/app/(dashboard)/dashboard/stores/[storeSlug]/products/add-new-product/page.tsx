import ProductForm from "@/components/dashboard/stores/product-form";

export default function StoreAddNewProductPage() {
  return (
    <div className="mb-10 mt-4 h-full">
      <div className="mt-6 w-1/2">
        <ProductForm productStatus="new-product" />
      </div>
    </div>
  );
}
