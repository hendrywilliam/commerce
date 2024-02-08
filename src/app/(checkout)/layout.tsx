import SiteHeader from "@/components/layouts/site-header";

export default function CheckoutLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="flex flex-col h-screen">
      <SiteHeader />
      {children}
    </div>
  );
}
