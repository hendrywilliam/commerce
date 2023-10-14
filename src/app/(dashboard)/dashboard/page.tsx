import { currentUser } from "@clerk/nextjs";
import Link from "next/link";
import { siteConfig } from "@/config/site-config";

export default async function DashboardPage() {
  const userDetails = await currentUser();

  return (
    <div className="h-full w-full">
      <h1 className="font-semibold text-2xl">Dashboard</h1>
      <p className="font-medium text-muted-foreground">
        Welcome to dashboard, {userDetails?.emailAddresses[0].emailAddress}
      </p>
      <div className="grid grid-cols-3 w-full mt-2 gap-2">
        {siteConfig.dashboardNavigation.map((item, i) => {
          return (
            <Link
              className="flex flex-col border rounded h-52"
              href={item.href}
              key={i}
            >
              <div className="relative h-3/4">
                <div className="absolute top-2 left-2 rounded-full border p-2">
                  <item.icon />
                </div>
              </div>
              <div className="flex-1 p-2 border-t">
                <p className="font-bold">{item.title}</p>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
