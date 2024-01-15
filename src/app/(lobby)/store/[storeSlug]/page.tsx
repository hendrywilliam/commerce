import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { stores } from "@/db/schema";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/pagination";
import { IconStores } from "@/components/ui/icons";
import ProductCard from "@/components/lobby/product-card";
import { get_products_page_fetcher } from "@/fetchers/products/get-products-page";
import StoreProductFilterPanel from "@/components/lobby/store/store-product-filter-panel";
import { get_all_products_and_store_fetcher } from "@/fetchers/products/get-all-products-and-stores";

export default async function StorePage({
  params,
  searchParams,
}: {
  params: { storeSlug: string };
  searchParams: {
    page: string;
    page_size: string;
    sort: string;
  };
}) {
  const storeSlug = params.storeSlug;

  const sort = searchParams.sort ?? "name.asc";
  const currentPage = isNaN(Number(searchParams.page))
    ? 1
    : Number(searchParams.page);
  const pageSize = isNaN(Number(searchParams.page_size))
    ? 10
    : Number(searchParams.page_size);

  const storeData = await db.query.stores.findFirst({
    where: eq(stores.slug, storeSlug),
  });

  if (!storeData) {
    notFound();
  }

  const [storeProducts, storeProductsCount] = await Promise.all([
    await get_all_products_and_store_fetcher({
      sellers: storeSlug,
      page: currentPage,
      pageSize,
      sort,
    }),
    await get_products_page_fetcher({
      sellers: storeSlug,
      pageSize,
    }),
  ]);

  return (
    <div className="flex flex-col container h-full w-full py-8">
      <div className="flex flex-col h-full w-full my-2 gap-2">
        <div className="mt-4">
          <div className="flex justify-between">
            <div className="flex-col my-4 gap-2">
              <h1 className="font-bold text-xl">{storeData?.name}</h1>
              <div>
                <Button variant={"outline"} className="inline-flex gap-2">
                  <IconStores />
                  Chat Store
                </Button>
              </div>
            </div>
            <div className="flex items-center">
              <StoreProductFilterPanel />
            </div>
          </div>
          {storeProducts.length ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 min-h-[720px] h-full">
                {storeProducts.map((storeProduct) => {
                  const product = storeProduct.products;
                  return <ProductCard product={product} key={product.id} />;
                })}
              </div>
              <Pagination
                totalPage={storeProductsCount}
                currentPage={currentPage}
              />
            </>
          ) : (
            <p>No product found</p>
          )}
        </div>
      </div>
    </div>
  );
}
