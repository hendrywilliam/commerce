import Link from "next/link";
import { dashboardNavigation } from "@/config/site";

export default async function DashboardPage() {
  return (
    <div className="flex h-full w-full items-center justify-center ">
      <div className="mt-2 grid max-w-3xl grid-cols-1 gap-6 lg:grid-cols-2 lg:grid-rows-2">
        {dashboardNavigation.slice(1).map((item, i) => {
          return (
            <Link
              className="flex h-52 flex-col justify-between rounded border p-6 hover:shadow-md"
              href={item.href}
              key={i}
            >
              <div className="relative w-max">
                <item.icon className="h-6 w-6" />
              </div>
              <div>
                <p>{item.title}</p>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
