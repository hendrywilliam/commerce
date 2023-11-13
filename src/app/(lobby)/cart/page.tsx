import { getCartAction } from "@/actions/carts/get-cart";

export default async function CartPage() {
  const { parsedCartItems, cartItemDetails } = await getCartAction();

  return (
    <div className="container mx-auto">
      <div>
        {cartItemDetails.map((cartItem) => (
          <p key={cartItem.id}>{cartItem.name}</p>
        ))}
      </div>
    </div>
  );
}
