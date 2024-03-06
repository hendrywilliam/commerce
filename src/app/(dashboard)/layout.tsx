import DashboardNavigation from "@/components/dashboard/dashboard-navigation";

export default function DashboardLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="flex h-screen flex-col">
      <div className="flex h-full flex-1 flex-col">
        <DashboardNavigation />
        <div className="h-full w-full overflow-y-auto">
          <div className="container py-10">{children}</div>
        </div>
      </div>
    </div>
  );
}
