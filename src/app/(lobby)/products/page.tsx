import Products from "@/components/lobby/products/products";
import { getAllStoresAction } from "@/actions/stores/get-all-stores";
import { getAllProductsAndStoresAction } from "@/actions/products/get-all-products-and-stores";
import { getProductsPageAction } from "@/actions/products/get-products-page";

interface ProductsPageProps {
  searchParams: {
    [key: string]: string;
  };
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const category = searchParams.category;
  const minPrice = searchParams.pmin ?? "0";
  const sort = searchParams.sort ?? "name.asc";
  const sellers = searchParams.sellers ?? "all";
  const maxPrice = searchParams.pmax ?? "9999999";
  const pageSize = Number(searchParams.page_size) ?? 10;
  const currentPage = isNaN(Number(searchParams.page))
    ? 1
    : Number(searchParams.page);

  // Do these simultaneously later.

  const allProductsAndStore = await getAllProductsAndStoresAction({
    sort,
    minPrice,
    maxPrice,
    sellers,
    category,
    pageSize,
    page: currentPage,
  });

  const stores = await getAllStoresAction();
  const productsPageCount = await getProductsPageAction({
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
          filterStoreItems={stores}
          productsPageCount={productsPageCount}
          currentPage={currentPage}
        />
      </section>
    </div>
  );
}
