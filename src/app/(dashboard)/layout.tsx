import DashboardHeader from "@/components/layouts/dashboard-header";

export default function DashboardLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="h-full w-full">
      <DashboardHeader />
      {children}
    </div>
  );
}
