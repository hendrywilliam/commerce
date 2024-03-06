"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboardNavigation } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import { ArrowOutwardIcon } from "@/components/ui/icons";

export default function DashboardNavigation() {
  const pathname = usePathname();
  return (
    <div className="flex w-full border-b text-sm">
      <div className="container flex justify-between">
        <div className="flex space-x-6 pt-4">
          {dashboardNavigation.map((item, index) => (
            <Link
              href={item.href}
              key={index}
              className="flex flex-col justify-between"
            >
              <span>{item.title}</span>
              {pathname === item.href && (
                <div className="border-1 mt-4 border-b border-black"></div>
              )}
            </Link>
          ))}
        </div>
        <div className="flex items-center">
          <Link
            href="/"
            className={buttonVariants({
              class: "inline-flex gap-1",
              variant: "outline",
            })}
          >
            Lobby
            <ArrowOutwardIcon />
          </Link>
        </div>
      </div>
    </div>
  );
}
