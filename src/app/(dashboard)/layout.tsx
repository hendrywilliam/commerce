import Link from "next/link";
import SiteHeader from "@/components/layouts/site-header";
import { dashboardNavigation } from "@/config/site";

export default function DashboardLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="flex flex-col h-screen">
      <SiteHeader />
      <div className="flex container flex-1 w-ful">
        <div className="h-full border-r w-1/6 gap-2">
          <div className="flex flex-col py-4 pr-6 gap-1">
            {dashboardNavigation.map((item, i) => {
              return (
                <Link
                  className="inline-flex gap-4 h-9 px-4 py-2 rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground font-semibold"
                  href={item.href}
                  key={i}
                >
                  <item.icon className="flex self-center" />
                  {item.title}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="w-full h-full pl-12 py-8 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
