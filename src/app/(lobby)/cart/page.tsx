import { CartLineDetailedItems } from "@/types";
import CartItem from "@/components/lobby/cart/cart-item";
import CartPanel from "@/components/lobby/cart/cart-panel";
import { get_cart_fetcher } from "@/fetchers/carts/get-cart";

export default async function CartPage() {
  const { cartItemDetails } = await get_cart_fetcher();

  const groupProductByTheStore = cartItemDetails.reduce(
    (acc, val) => {
      const { storeName } = val;
      acc[storeName] = acc[storeName] ?? [];
      acc[storeName].push(val);
      return acc;
    },
    {} as Record<
      Pick<CartLineDetailedItems, "storeName">["storeName"],
      CartLineDetailedItems[]
    >,
  );

  return (
    <div className="container mx-auto h-full py-8">
      <h1 className="font-semibold text-2xl">Cart</h1>
      <div className="flex mt-2 gap-4">
        <div className="w-3/4">
          {cartItemDetails.length ? (
            <div className="flex flex-col gap-4">
              {Object.entries(groupProductByTheStore).map(
                ([storeName, storeItem], i) => (
                  <div className="w-full" key={i}>
                    <h1 className="font-semibold">{storeName}</h1>
                    {storeItem.map((item) => (
                      <CartItem key={item.id} cartItem={item} />
                    ))}
                  </div>
                ),
              )}
            </div>
          ) : (
            <p>You dont have any item in your current cart.</p>
          )}
        </div>
        {!!cartItemDetails.length && (
          <div className="w-1/4">
            <CartPanel products={groupProductByTheStore} />
          </div>
        )}
      </div>
    </div>
  );
}
