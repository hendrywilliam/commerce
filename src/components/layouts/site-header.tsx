import SearchNavigation from "@/components/layouts/search-nav";
import AccountNavigation from "@/components/layouts/account-nav";

export default function SiteHeader() {
  return (
    <div className="fixed top-0 z-10 h-16 w-full border-b bg-background">
      <div className="container flex justify-between h-full items-center">
        <div className="font-bold w-1/3">twopointone.</div>
        <SearchNavigation />
        <AccountNavigation />
      </div>
    </div>
  );
}
