import ProductCardSkeleton from "@/components/lobby/product-card-skeleton";

export default function ProductsLoading() {
  return (
    <div className="flex flex-col container h-full w-full py-8 gap-4">
      <h1 className="font-bold text-2xl">Browse All Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 min-h-[720px] h-full">
        {Array.from({ length: 10 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
