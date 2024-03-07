import Link from "next/link";
import { dashboardNavigation } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";

export default async function DashboardPage() {
  return (
    <div className="flex h-full w-full items-center justify-center ">
      <div className="flex h-full w-full justify-center gap-2">
        {dashboardNavigation.slice(1).map((item, i) => {
          return (
            <Link
              className={buttonVariants({ class: "inline-flex gap-2" })}
              href={item.href}
              key={i}
            >
              <item.icon />
              <p>{item.title}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
