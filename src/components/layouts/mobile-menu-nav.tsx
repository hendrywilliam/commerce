import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";
import { siteName, navigationMenu } from "@/config/site";
import { HamburgerMenuIcon } from "@/components/ui/icons";

export default function MobileMenuNavigation() {
  return (
    <Sheet>
      <SheetTrigger
        className={buttonVariants({ variant: "outline", size: "icon" })}
      >
        <HamburgerMenuIcon />
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle className="text-start">{siteName}</SheetTitle>
          <div className="flex flex-col text-start pl-4 space-y-3">
            {Object.entries(navigationMenu).map(([key, menus], index) => (
              <div key={index}>
                <p className="font-semibold capitalize">{key}</p>
                <div className="flex flex-col space-y-3 mt-2">
                  {menus.map((menu, i) => (
                    <Link
                      className="text-md text-gray-500"
                      href={menu.href}
                      key={i}
                    >
                      {menu.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
