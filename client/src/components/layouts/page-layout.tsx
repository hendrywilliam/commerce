import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

export default function PageLayout({
  children,
  className,
}: PropsWithChildren & { className?: string }) {
  return (
    <div
      className={cn([
        "flex flex-col container h-full w-full py-8 gap-4 px-4 lg:px-8",
        className,
      ])}
    >
      {children}
    </div>
  );
}
