"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { dashboardNavigation } from "@/config/site";

export default function DashboardNavigation() {
  const pathname = usePathname();
  return (
    <div className="flex py-4 gap-2">
      {dashboardNavigation.map((item, index) => {
        return (
          <Link
            className={cn([
              "inline-flex h-9 px-4 py-2 rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground font-semibold",
              pathname.includes(item.href) && "bg-black text-white",
            ])}
            href={item.href}
            key={index}
          >
            {item.title}
          </Link>
        );
      })}
    </div>
  );
}
