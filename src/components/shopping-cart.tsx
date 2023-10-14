import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";
import { IconCart } from "./ui/icons";
import { db } from "@/db/core";
import { carts } from "@/db/schema";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";

export default async function ShoppingCart() {
  const cartIdFromCookie = cookies().get("cart_id")?.value;
  const getCart = await db
    .select({
      id: carts.id,
      items: carts.items,
    })
    .from(carts)
    .where(eq(carts.id, Number(cartIdFromCookie)));

  return (
    <>
      <Sheet>
        <SheetTrigger
          className={buttonVariants({
            variant: "outline",
            size: "icon",
            class: "relative rounded",
          })}
        >
          <div className="absolute px-1.5 -top-1 -right-1 rounded-full border bg-background text-xs">
            <p>{JSON.parse(getCart[0].items).length}</p>
          </div>
          <IconCart />
        </SheetTrigger>
        <SheetContent>
          <div>
            <h1 className="font-semibold">Cart (1)</h1>
            <p>{getCart.length}</p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
