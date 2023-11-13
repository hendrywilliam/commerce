import { CartLineDetailedItems } from "@/types";
import { getCartAction } from "@/actions/carts/get-cart";
import CartItem from "@/components/lobby/cart/cart-item";
import CartPanel from "@/components/lobby/cart/cart-panel";

export default async function CartPage() {
  const { cartItemDetails } = await getCartAction();

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
    >
  );

  return (
    <div className="container mx-auto h-full py-8">
      <h1 className="font-semibold text-2xl">Cart</h1>
      <div className="flex mt-2">
        <div className="w-full">
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
                )
              )}
            </div>
          ) : (
            <p>You dont have any item in your current cart.</p>
          )}
        </div>
        <div className="w-full">
          <CartPanel />
        </div>
      </div>
    </div>
  );
}
