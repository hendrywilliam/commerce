import { Button } from "@/components/ui/button";
import { IconStores } from "@/components/ui/icons";
import ProductCard from "@/components/lobby/product-card";
import { getStoreProductsAction } from "@/actions/products/get-store-products";

export default async function StoresPage({
  params: { storeId },
}: {
  params: {
    storeId: string[];
  };
}) {
  const products = await getStoreProductsAction(storeId[0]);

  return (
    <div className="flex flex-col container h-full w-full py-8">
      <div className="flex flex-col h-full w-full my-2 gap-2">
        <div className="mt-4">
          <div className="flex flex-col my-4 gap-2">
            <h1 className="font-bold text-xl">{products[0].store?.name}</h1>
            <div>
              <Button variant={"outline"} className="inline-flex gap-2">
                <IconStores />
                Chat Store
              </Button>
            </div>
          </div>
          {products.length ? (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {products.map(({ product }) => (
                <ProductCard product={product} key={product.id} />
              ))}
            </div>
          ) : (
            <p>No product found</p>
          )}
        </div>
      </div>
    </div>
  );
}
