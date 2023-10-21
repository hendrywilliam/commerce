import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";
import { IconCart } from "@/components/ui/icons";
import { getCartAction } from "@/actions/carts/get-cart";
import { getCartDetailsAction } from "@/actions/carts/get-cart-details";
import ShoppingCartItem from "@/components/lobby/shopping-cart-item";
import { Button } from "@/components/ui/button";

export default async function ShoppingCart() {
  const cartItems = await getCartAction();
  const cartItemsDetails = await getCartDetailsAction(cartItems);

  const sumQty = cartItems.reduce((acc, val) => acc + Number(val.qty), 0);

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
            <p>{sumQty > 99 ? 99 : sumQty}</p>
          </div>
          <IconCart />
        </SheetTrigger>
        <SheetContent>
          <div className="flex flex-col justify-between h-full">
            <div className="flex flex-col">
              <h1 className="font-semibold">Cart ({sumQty})</h1>
              <div className="mt-4">
                {cartItemsDetails.map((item) => {
                  return <ShoppingCartItem product={item} key={item.id} />;
                })}
              </div>
            </div>
            <div className="w-ful">
              <Button className="w-full">Checkout</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
