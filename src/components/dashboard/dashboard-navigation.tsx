"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboardNavigation } from "@/config/site";
import { ArrowOutwardIcon } from "@/components/ui/icons";

export default function DashboardNavigation() {
  const pathname = usePathname();
  return (
    <div className="flex h-max w-full border-b text-sm">
      <div className="container flex justify-between">
        <div className="flex items-center space-x-6">
          {dashboardNavigation.map((item, index) => (
            <Link
              href={item.href}
              key={index}
              className="flex flex-col justify-between"
            >
              <span className="mb-1 py-4">{item.title}</span>
              {pathname === item.href && (
                <div className="border-1 border-b border-black"></div>
              )}
            </Link>
          ))}
        </div>
        <div className="flex items-center">
          <Link href="/" className="inline-flex items-center gap-1">
            Return to Lobby
            <ArrowOutwardIcon />
          </Link>
        </div>
      </div>
    </div>
  );
}
