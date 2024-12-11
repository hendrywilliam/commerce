import { IconCart } from "@/components/ui/icons";
import type { CartLineDetailedItems } from "@/types";
import { buttonVariants } from "@/components/ui/button";
import { getCartFetcher } from "@/fetchers/carts/get-cart";
import ShoppingCartItem from "@/components/lobby/shopping-cart-item";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ShoppingCartSummary from "@/components/lobby/shopping-cart-summary";

export default async function ShoppingCart() {
  const { items, cartItemDetails } = await getCartFetcher();

  const sumQty = items.reduce((acc, val) => acc + Number(val.qty), 0);

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
        <div className="absolute -right-1 -top-1 rounded-full border bg-background px-1.5 text-xs">
          <p data-testid="cart-items-indicator">{sumQty > 99 ? 99 : sumQty}</p>
        </div>
        <IconCart />
      </SheetTrigger>
      <SheetContent className="h-full w-[400px] overflow-y-auto p-4 sm:w-[540px]">
        {items.length > 0 ? (
          <div className="h-full flex-col">
            <div className="mb-2">
              <h1 className="font-semibold">Cart ({sumQty})</h1>
            </div>
            <div className="flex flex-col">
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
            <div className="h-auto py-2">
              <ShoppingCartSummary cartItemDetails={cartItemDetails} />
            </div>
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center">
            <IconCart width={60} height={60} />
            <p className="text-gray-400">You dont have any item in your cart</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
