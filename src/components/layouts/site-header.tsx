import Link from "next/link";
import ShoppingCart from "@/components/lobby/shopping-cart";
import ProductSearch from "@/components/lobby/product-search";
import AccountNavigation from "@/components/layouts/account-nav";

export default async function SiteHeader() {
  return (
    <nav className="sticky top-0 z-10 py-2 w-full border-b bg-background">
      <div className="container flex justify-between h-full items-center">
        <div className="flex w-1/2 items-center font-semibold">
          <Link href="/">commerce</Link>
        </div>
        <div className="inline-flex gap-2 w-1/2 justify-end">
          <ProductSearch />
          <ShoppingCart />
          <AccountNavigation />
        </div>
      </div>
    </nav>
  );
}
