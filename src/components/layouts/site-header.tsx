import Link from "next/link";
import { siteName } from "@/config/site";
import ShoppingCart from "@/components/lobby/shopping-cart";
import ProductSearch from "@/components/lobby/product-search";
import AccountNavigation from "@/components/layouts/account-nav";
import MenuNavigation from "@/components/layouts/menu-nav";

export default async function SiteHeader() {
  return (
    <nav className="sticky top-0 z-10 py-2 w-full border-b bg-background">
      <div className="container flex justify-between h-full items-center">
        <div className="hidden md:flex items-center font-semibold">
          <Link href="/" className="mr-6">
            {siteName}
          </Link>
          <MenuNavigation />
        </div>
        <div className="inline-flex gap-2 justify-end">
          <ProductSearch />
          <ShoppingCart />
          <AccountNavigation />
        </div>
      </div>
    </nav>
  );
}
