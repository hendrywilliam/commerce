import AccountNavigation from "@/components/layouts/account-nav";
import Link from "next/link";
import { IconPointAside } from "@/components/ui/icons";

export default function SiteHeader() {
  return (
    <div className="fixed top-0 z-10 h-16 w-full border-b bg-background">
      <div className="container flex justify-between h-full items-center">
        <div className="flex font-bold w-1/3 items-center">
          <IconPointAside />
          <Link href="/">POINTASIDE</Link>
        </div>
        <AccountNavigation />
      </div>
    </div>
  );
}
