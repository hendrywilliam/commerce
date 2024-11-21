import SiteHeader from "@/components/layouts/site-header";

export default function CheckoutLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="flex flex-col min-h-screen h-fit">
      <SiteHeader />
      {children}
    </div>
  );
}
