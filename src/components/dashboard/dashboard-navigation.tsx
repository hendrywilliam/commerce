"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { dashboardNavigation } from "@/config/site";
import DashboardNavigationUserPanel from "@/components/dashboard/dashboard-navigation-user-panel";

export default function DashboardNavigation() {
  const pathname = usePathname();
  return (
    <div className="flex flex-col p-6 w-[300px] justify-between bg-black text-accent-foreground">
      <div className="flex flex-col">
        <div>
          <div className="relative w-9 h-9 border rounded">
            <Image
              src="/images/image-logo.png"
              alt="Commerce's logo"
              fill
              style={{
                objectFit: "contain",
              }}
            />
          </div>
        </div>
        <div className="flex flex-col space-y-2 mt-10">
          {dashboardNavigation.map((item, index) => {
            return (
              <Link
                className={cn([
                  "inline-flex h-9 px-2 py-2 rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground font-semibold",
                  pathname.includes(item.href) && "bg-accent text-primary",
                ])}
                href={item.href}
                key={index}
              >
                {item.title}
              </Link>
            );
          })}
        </div>
      </div>
      <DashboardNavigationUserPanel />
    </div>
  );
}
