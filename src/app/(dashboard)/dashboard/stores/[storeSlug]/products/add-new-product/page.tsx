import ProductForm from "@/components/dashboard/stores/product-form";

export default function StoreAddNewProductPage() {
  return (
    <>
      <div className="w-full">
        <div className="w-full inline-flex border-b pb-4">
          <div className="w-full">
            <h1 className="font-bold text-2xl">New Product</h1>
            <p className="text-gray-500">Add new product to your store.</p>
          </div>
          <div className="flex-1"></div>
        </div>
      </div>
      <div className="mt-6 w-1/2">
        <ProductForm />
      </div>
    </>
  );
}
