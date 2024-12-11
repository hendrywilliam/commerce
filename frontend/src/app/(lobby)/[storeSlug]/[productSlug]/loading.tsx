import LoadingSkeleton from "@/components/loading-skeleton";

export default function ProductLoading() {
  return (
    <div className="container flex h-full w-full flex-col space-y-4 pb-8">
      <div className="my-2 flex h-max w-full flex-col gap-10 lg:flex-row">
        <div className="group relative h-full w-full overflow-hidden rounded">
          <div className="relative w-full overflow-hidden rounded border">
            <LoadingSkeleton className="h-[700px] w-full" />
          </div>
        </div>
        <div className="flex w-full flex-col gap-4 space-y-4">
          <div className="w-full">
            <LoadingSkeleton className="h-5" />
          </div>
          <div className="w-full">
            <LoadingSkeleton className="h-10" />
          </div>
          <div className="w-full">
            <LoadingSkeleton className="h-10" />
          </div>
          <div className="flex w-full flex-col gap-4">
            <LoadingSkeleton className="h-5 w-full" />
            <LoadingSkeleton className="h-5 w-full" />
            <LoadingSkeleton className="h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
