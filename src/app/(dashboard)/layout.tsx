import DashboardNavigation from "@/components/dashboard/dashboard-navigation";

export default function DashboardLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="h-screen">
      <div className="flex h-full flex-1 flex-col">
        <DashboardNavigation />
        <div className="flex h-full w-full flex-1 flex-col overflow-y-auto">
          <div className="container py-10">{children}</div>
        </div>
      </div>
    </div>
  );
}
