import { CartLineDetailedItems, CartItem } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface ShoppingCartSummaryProps {
  cartItemDetails: CartLineDetailedItems[];
}

export default function ShoppingCartSummary({
  cartItemDetails,
}: ShoppingCartSummaryProps) {
  const calculateTotalPrice = cartItemDetails.reduce((total, item) => {
    return total + item.qty * Number(item.price);
  }, 0);

  return (
    <div className="border-t space-y-2 py-2 h-28">
      <div className="flex justify-between">
        <p>Shipping</p>
        <p>Free</p>
      </div>
      <div className="flex justify-between">
        <p>Tax</p>
        <p>Calculated at checkout</p>
      </div>
      <div className="flex justify-between">
        <p>Total</p>
        <p>{formatCurrency(calculateTotalPrice)}</p>
      </div>
    </div>
  );
}
