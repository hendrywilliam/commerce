import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface LoadingSkeleton extends HTMLAttributes<HTMLDivElement> {}
type SkeletonRef = HTMLDivElement;

const LoadingSkeleton = forwardRef<SkeletonRef, LoadingSkeleton>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className="h-full animate-pulse">
      <div
        className={cn("w-1/2 rounded bg-border", className)}
        {...props}
      ></div>
    </div>
  ),
);

LoadingSkeleton.displayName = "LoadingSkeleton";

export default LoadingSkeleton;
