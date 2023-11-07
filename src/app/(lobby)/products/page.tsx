import { getAllProductsAction } from "@/actions/products/get-all-products";
import FeaturedProductCard from "@/components/lobby/product-card";
import Products from "@/components/lobby/products/products";
// import ProductsFilterController from "@/components/lobby/products/products-filter-controller";

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
  const offset = Number(searchParams.offset) ?? 0;

  const products = await getAllProductsAction({
    sort,
    offset,
    minPrice,
    maxPrice,
  });

  return (
    <div className="flex flex-col container h-full w-full py-8">
      <section>
        <Products products={products} />
      </section>

      {/* <section className="grid grid-cols-4 gap-2">
        {allProducts.map((product) => (
          <FeaturedProductCard product={product} key={product.id} />
        ))}
      </section> */}
    </div>
  );
}
