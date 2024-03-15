import SiteHeader from "@/components/layouts/site-header";
import SiteFooter from "@/components/layouts/site-footer";
import Breadcrumbs from "@/components/breadcrumbs";

export default function LobbyLayout(props: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex min-h-screen w-full flex-col">
        <SiteHeader />
        <Breadcrumbs />
        <main className="flex-1">{props.children}</main>
        <SiteFooter />
      </div>
      {props.modal}
    </div>
  );
}
