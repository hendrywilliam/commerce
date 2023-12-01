import { SubscriptionCheckout } from "@/components/lobby/checkout/subscription-checkout";

export default function SubscriptionCheckoutPage() {
  return (
    <div className="flex flex-col container h-full w-full py-8 gap-4">
      <h1 className="font-semibold text-2xl">Checkout</h1>
      <section className="flex flex-col lg:flex-row gap-4"></section>
      <div className="w-full flex flex-col lg:w-3/4 gap-4">
        <div className="border p-4 rounded">
          <SubscriptionCheckout />
        </div>
      </div>
    </div>
  );
}
