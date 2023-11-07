import { getAllProductsAction } from "@/actions/products/get-all-products";
import FeaturedProductCard from "@/components/lobby/featured-product-card";
import ProductsFilter from "@/components/lobby/products/products-filter";

interface ProductsPageProps {
  searchParams: {
    [key: string]: string;
  };
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const allProducts = await getAllProductsAction({
    sort: searchParams.sort,
  });

  return (
    <div className="flex flex-col container h-full w-full py-8">
      <p>{searchParams.sort}</p>
      <div className="my-2 inline-flex justify-between">
        <div>
          <h1 className="font-bold text-2xl">Products Explorer</h1>
          <p>
            Browse any products with ease. You can also apply filter to narrow
            the results.
          </p>
        </div>
        <div>
          <ProductsFilter />
        </div>
      </div>
      <section className="grid grid-cols-4 gap-2">
        {allProducts.map((product) => (
          <FeaturedProductCard product={product} key={product.id} />
        ))}
      </section>
    </div>
  );
}
