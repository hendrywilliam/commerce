import LoadingSkeleton from "@/components/loading-skeleton";

export default function ProductCardSkeleton() {
  return (
    <div className="h-80 w-full border">
      <LoadingSkeleton className="w-full h-52" />
      <div className="h-2/6 border-t p-2 space-y-4">
        <LoadingSkeleton className="h-4 mt-2" />
        <LoadingSkeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
}
