import SiteHeader from "@/components/layouts/site-header";
import SiteFooter from "@/components/layouts/site-footer";

export default function LobbyLayout(props: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div>
      <div>
        <SiteHeader />
        <div className="pt-16 min-h-screen h-full w-full">{props.children}</div>
        <SiteFooter />
      </div>
      {props.modal}
    </div>
  );
}
