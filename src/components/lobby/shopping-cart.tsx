import Link from "next/link";
import { IconCart } from "@/components/ui/icons";
import type { CartLineDetailedItems } from "@/types";
import { buttonVariants } from "@/components/ui/button";
import { get_cart_fetcher } from "@/fetchers/carts/get-cart";
import ShoppingCartItem from "@/components/lobby/shopping-cart-item";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ShoppingCartSummary from "@/components/lobby/shopping-cart-summary";

export default async function ShoppingCart() {
  const { parsedCartItems, cartItemDetails } = await get_cart_fetcher();

  const sumQty = parsedCartItems.reduce((acc, val) => acc + Number(val.qty), 0);

  // Grouping products by its store.
  const groupProductByItsStore = cartItemDetails.reduce(
    (storeGroup, product) => {
      const { storeName } = product;
      storeGroup[storeName] = storeGroup[storeName] ?? [];
      storeGroup[storeName].push(product);
      return storeGroup;
    },
    {} as Record<
      Pick<CartLineDetailedItems, "storeName">["storeName"],
      CartLineDetailedItems[]
    >,
  );

  return (
    <Sheet>
      <SheetTrigger
        className={buttonVariants({
          variant: "outline",
          size: "icon",
          class: "relative rounded",
        })}
        data-testid="cart-trigger"
      >
        <div className="absolute px-1.5 -top-1 -right-1 rounded-full border bg-background text-xs">
          <p data-testid="cart-items-indicator">{sumQty > 99 ? 99 : sumQty}</p>
        </div>
        <IconCart />
      </SheetTrigger>
      <SheetContent>
        {parsedCartItems.length > 0 ? (
          <div className="h-full flex flex-col justify-between">
            <div className=" h-full">
              <div className="flex flex-col">
                <h1 className="font-semibold">Cart ({sumQty})</h1>
                <div className="mt-4"></div>
              </div>
              <div className="flex flex-col w-full h-full overflow-y-auto gap-2">
                {Object.entries(groupProductByItsStore).map(
                  ([storeName, products], i) => {
                    return (
                      <div key={i}>
                        <h1 className="font-semibold">{storeName}</h1>
                        {products.map((product) => {
                          return (
                            <ShoppingCartItem
                              key={product.id}
                              cartLineDetailedItem={product}
                            />
                          );
                        })}
                      </div>
                    );
                  },
                )}
              </div>
            </div>
            <ShoppingCartSummary cartItemDetails={cartItemDetails} />
            <Link
              href={"/cart"}
              className={buttonVariants({ class: "w-full" })}
              data-testid="view-full-cart-button"
            >
              View Full Cart
            </Link>
          </div>
        ) : (
          <div className="flex flex-col h-full w-full justify-center items-center">
            <IconCart width={60} height={60} />
            <p className="text-gray-400">You dont have any item in your cart</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
