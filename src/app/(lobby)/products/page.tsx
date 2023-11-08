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
  const offset = Number(searchParams.offset) ?? 0;

  const allProductsAndStore = await getAllProductsAndStoresAction({
    sort,
    offset,
    minPrice,
    maxPrice,
    sellers,
  });

  const stores = await getAllStoresAction();

  return (
    <div className="flex flex-col container h-full w-full py-8">
      <section>
        <Products
          allStoresAndProducts={allProductsAndStore}
          filterStoreItems={stores}
        />
      </section>
    </div>
  );
}
