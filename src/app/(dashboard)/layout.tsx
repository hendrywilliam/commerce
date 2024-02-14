import SiteHeader from "@/components/layouts/site-header";
import DashboardNavigation from "@/components/dashboard/dashboard-navigation";

export default function DashboardLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="flex flex-col h-screen">
      <SiteHeader />
      <div className="flex flex-col container flex-1">
        <DashboardNavigation />
        <div className="w-full h-full overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
