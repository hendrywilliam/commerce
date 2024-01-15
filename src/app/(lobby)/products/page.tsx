import { db } from "@/db/core";
import { asc } from "drizzle-orm";
import { stores } from "@/db/schema";
import Products from "@/components/lobby/products/products";
import { get_products_page_fetcher } from "@/fetchers/products/get-products-page";
import { get_all_products_and_store_fetcher } from "@/fetchers/products/get-all-products-and-stores";

interface ProductsPageProps {
  searchParams: {
    [key: string]: string;
  };
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const sellers = searchParams.sellers;
  const category = searchParams.category;
  const minPrice = searchParams.pmin ?? "0";
  const sort = searchParams.sort ?? "name.asc";
  const maxPrice = searchParams.pmax ?? "9999999";

  // Empty / non existence searchParams property will be consider as undefined.
  const currentPage = isNaN(Number(searchParams.page))
    ? 1
    : Number(searchParams.page);
  const pageSize = isNaN(Number(searchParams.page_size))
    ? 10
    : Number(searchParams.page_size);

  const allProductsAndStore = await get_all_products_and_store_fetcher({
    sort,
    minPrice,
    maxPrice,
    sellers,
    category,
    pageSize,
    page: currentPage,
  });

  const allStores = await db.select().from(stores).orderBy(asc(stores.name));
  const productsPageCount = await get_products_page_fetcher({
    pageSize,
    category,
    sellers,
    minPrice,
    maxPrice,
  });

  return (
    <div className="flex flex-col container h-full w-full py-8">
      <section>
        <h1 className="font-bold text-xl">Browse All Products</h1>
        <Products
          allStoresAndProducts={allProductsAndStore}
          filterStoreItems={allStores}
          productsPageCount={productsPageCount}
          currentPage={currentPage}
        />
      </section>
    </div>
  );
}
