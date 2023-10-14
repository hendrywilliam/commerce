import AccountNavigation from "@/components/layouts/account-nav";
import Link from "next/link";
import ProductSearch from "@/components/product-search";
import ShoppingCart from "@/components/shopping-cart";
export default async function SiteHeader() {
  return (
    <div className="sticky top-0 z-10 h-16 w-full border-b bg-background">
      <div className="container flex justify-between h-full items-center">
        <div className="flex font-bold w-1/2 items-center">
          <Link href="/">POINTASIDE</Link>
        </div>
        <div className="inline-flex gap-2 w-1/2 justify-end">
          <ProductSearch />
          <ShoppingCart />
          <AccountNavigation />
        </div>
      </div>
    </div>
  );
}
