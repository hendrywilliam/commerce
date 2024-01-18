import SiteHeader from "@/components/layouts/site-header";
import SiteFooter from "@/components/layouts/site-footer";

export default function LobbyLayout(props: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex flex-col min-h-screen w-full text-sm">
        <SiteHeader />
        <main className="flex-1">{props.children}</main>
        <SiteFooter />
      </div>
      {props.modal}
    </div>
  );
}
