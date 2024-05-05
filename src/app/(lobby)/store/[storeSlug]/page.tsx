import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { stores } from "@/db/schema";
import { notFound } from "next/navigation";
import Pagination from "@/components/pagination";
import { Metadata, ResolvingMetadata } from "next";
import { siteStaticMetadata } from "@/config/site";
import ProductCard from "@/components/lobby/product-card";
import { get_products_page_fetcher } from "@/fetchers/products/get-products-page";
import StoreProductFilterPanel from "@/components/lobby/store/store-product-filter-panel";
import { get_all_products_and_store_fetcher } from "@/fetchers/products/get-all-products-and-stores";

interface StorePageProps {
  params: { storeSlug: string };
  searchParams: {
    page: string;
    page_size: string;
    sort: string;
  };
}

export async function generateMetadata(
  { params }: StorePageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const store = await db.query.stores.findFirst({
    where: eq(stores.slug, params.storeSlug),
  });

  return {
    title: store?.name ? `${store?.name} — commerce` : "commerce by hendryw",
    description:
      store?.description ??
      "A fictional marketplace built with everything new in Next.js 14",
    ...siteStaticMetadata,
  } satisfies Metadata;
}

export default async function StorePage({
  params,
  searchParams,
}: StorePageProps) {
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
    <div className="container flex h-full w-full flex-col py-8">
      <div className="my-2 flex h-full w-full flex-col gap-2">
        <div>
          <div className="flex justify-between">
            <div className="my-4 flex-col gap-2">
              <h1 className="text-xl font-bold">{storeData?.name}</h1>
            </div>
            <div className="flex items-center">
              <StoreProductFilterPanel />
            </div>
          </div>
          {!!storeProducts.length ? (
            <>
              <div className="grid h-full min-h-[720px] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
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
            <div className="flex min-h-[450px] items-center justify-center text-center">
              <h1 className="text-xl">
                No product in this store or try to refresh the page.
              </h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
