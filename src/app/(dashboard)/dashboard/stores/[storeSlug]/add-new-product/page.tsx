import ProductForm from "@/components/dashboard/stores/product-form";

export default function StoreAddNewProductPage() {
  return (
    <div>
      <div className="h-1/2 w-full">
        <div className="w-full inline-flex border-b pb-4">
          <div className="w-full">
            <h1 className="font-bold text-2xl w-[75%]">Store Product</h1>
            <p className="w-[75%]">Add new product to your store.</p>
          </div>
          <div className="flex-1"></div>
        </div>
      </div>
      <div className="mt-6 w-1/2">
        <ProductForm productStatus="new-product" />
      </div>
    </div>
  );
}
