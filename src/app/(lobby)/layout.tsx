import SiteHeader from "@/components/layouts/site-header";
import SiteFooter from "@/components/layouts/site-footer";

export default function LobbyLayout({ children }: React.PropsWithChildren) {
  return (
    <div>
      <SiteHeader />
      <div className="pt-16 min-h-screen h-full w-full">{children}</div>
      <SiteFooter />
    </div>
  );
}
