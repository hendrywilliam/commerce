import DashboardNavigation from "@/components/dashboard/dashboard-navigation";

export default function DashboardLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="h-full min-h-screen w-full">
      <div className="flex h-full flex-col">
        <DashboardNavigation />
        <div className="flex h-full flex-col overflow-y-auto">
          <div className="container h-full py-10">{children}</div>
        </div>
      </div>
    </div>
  );
}
