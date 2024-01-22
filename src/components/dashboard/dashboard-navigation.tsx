"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { dashboardNavigation } from "@/config/site";

export default function DashboardNavigation() {
  const pathname = usePathname();
  return (
    <div className="h-full border-r w-1/6 gap-2">
      <div className="flex flex-col py-4 pr-6 gap-1">
        {dashboardNavigation.map((item, index) => {
          return (
            <Link
              className={cn([
                "inline-flex gap-4 h-9 px-4 py-2 rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground font-semibold",
                pathname.includes(item.href) && "bg-black text-white",
              ])}
              href={item.href}
              key={index}
            >
              <item.icon className="flex self-center" />
              {item.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
