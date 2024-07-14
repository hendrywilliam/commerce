import LoadingSkeleton from "@/components/loading-skeleton";
import ProductCardSkeleton from "@/components/lobby/product-card-skeleton";

export default function StoreLoading() {
  return (
    <div className="flex flex-col container h-full w-full py-8 gap-4">
      <div>
        <LoadingSkeleton className="h-7 w-36" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 min-h-[720px] h-full">
        {Array.from({ length: 10 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
