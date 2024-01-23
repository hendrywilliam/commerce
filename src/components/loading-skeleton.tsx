import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface LoadingSkeleton extends HTMLAttributes<HTMLDivElement> {}
type SkeletonRef = HTMLDivElement;

const LoadingSkeleton = forwardRef<SkeletonRef, LoadingSkeleton>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className="animate-pulse h-max">
      <div
        className={cn("h-3 bg-border rounded w-2/4", className)}
        {...props}
      ></div>
    </div>
  ),
);

LoadingSkeleton.displayName = "LoadingSkeleton";

export default LoadingSkeleton;
