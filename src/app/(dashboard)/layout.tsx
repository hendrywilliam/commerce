import DashboardNavigation from "@/components/dashboard/dashboard-navigation";

export default function DashboardLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1">
        <DashboardNavigation />
        <div className="w-full h-full overflow-y-auto p-10">{children}</div>
      </div>
    </div>
  );
}
