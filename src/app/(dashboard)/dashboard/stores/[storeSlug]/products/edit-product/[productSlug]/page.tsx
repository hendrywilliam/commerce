import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { products } from "@/db/schema";
import { notFound } from "next/navigation";
import ProductForm from "@/components/dashboard/stores/product-form";

interface EditProductPageProps {
  params: {
    storeSlug: string;
    productSlug: string;
  };
  searchParams: {
    [key: string]: string;
  };
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const productDetails = await db.query.products.findFirst({
    where: eq(products.slug, params.productSlug),
  });

  if (!productDetails) {
    notFound();
  }

  return (
    <div className="mt-4 mb-10">
      <div className="w-full">
        <div className="w-full inline-flex border-b pb-4">
          <div className="w-full">
            <h1 className="font-bold text-2xl">Edit Product</h1>
            <p className="text-gray-500">
              Modify an existing product in your store.
            </p>
          </div>
          <div className="flex-1"></div>
        </div>
      </div>
      <div className="mt-6 w-1/2">
        <ProductForm
          productStatus="existing-product"
          initialValues={productDetails}
        />
      </div>
    </div>
  );
}
