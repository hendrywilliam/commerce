import DashboardNavigation from "@/components/dashboard/dashboard-navigation";

export default function DashboardLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="flex h-screen">
      <DashboardNavigation />
      <div className="w-full h-full overflow-y-auto p-10">{children}</div>
    </div>
  );
}
