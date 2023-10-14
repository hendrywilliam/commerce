import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";
import { IconCart } from "@/components/ui/icons";
import { getCart } from "@/actions/carts/get-cart";

export default async function ShoppingCart() {
  const cartDetails = (await getCart()) as {
    id: string;
    qty: string;
  }[];

  const sumQty = cartDetails.reduce((acc, val) => acc + Number(val.qty), 0);

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
            <p>{sumQty}</p>
          </div>
          <IconCart />
        </SheetTrigger>
        <SheetContent>
          <div>
            <h1 className="font-semibold">Cart (1)</h1>
            {cartDetails.map((item) => {
              return <p key={item.id}>{item.qty}</p>;
            })}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
