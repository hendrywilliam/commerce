import { CartLineDetailedItems, CartItem } from "@/types";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { IconCart } from "@/components/ui/icons";

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
    <div className="space-y-2 py-2 text-sm">
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
      <Link
        href="/cart"
        className={buttonVariants({ class: "flex h-14 w-full gap-2" })}
        data-testid="view-full-cart-button"
      >
        View Full Cart
        <IconCart />
      </Link>
    </div>
  );
}
