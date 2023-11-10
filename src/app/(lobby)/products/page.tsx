import { getAllProductsAndStoresAction } from "@/actions/products/get-all-products-and-stores";
import Products from "@/components/lobby/products/products";
import { getAllStoresAction } from "@/actions/stores/get-all-stores";

interface ProductsPageProps {
  searchParams: {
    [key: string]: string;
  };
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const sort = searchParams.sort ?? "name.asc";
  const minPrice = searchParams.pmin ?? "0";
  const maxPrice = searchParams.pmax ?? "9999999";
  const sellers = searchParams.sellers ?? "all";
  const category = searchParams.category;
  const offset = Number(searchParams.offset) ?? 0;

  const allProductsAndStore = await getAllProductsAndStoresAction({
    sort,
    offset,
    minPrice,
    maxPrice,
    sellers,
    category,
  });

  const stores = await getAllStoresAction();

  return (
    <div className="flex flex-col container h-full w-full py-8">
      <section>
        <h1 className="font-bold text-xl">Browse All Products</h1>
        <Products
          allStoresAndProducts={allProductsAndStore}
          filterStoreItems={stores}
        />
      </section>
    </div>
  );
}
