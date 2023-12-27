import Stripe from "stripe";

interface OrderStatusProps {
  orderStatus: Stripe.PaymentIntent.Status;
}

export default function OrderStatus({ orderStatus }: OrderStatusProps) {
  if (orderStatus === "succeeded") {
    return (
      <div className="w-full lg:w-1/2 p-4 rounded border border-green-400 bg-green-400/10">
        <h1 className="font-semibold text-2xl text-green-400">
          Payment Succeeded!
        </h1>
        <p>
          Thank you for your purchase. Your items will be delivered next to your
          door.
        </p>
      </div>
    );
  }

  if (orderStatus === "processing") {
    return (
      <div className="w-full lg:w-1/2 p-4 rounded border border-yellow-400 bg-yellow-400/10">
        <h1 className="font-semibold text-2xl text-yellow-400">Heads up!</h1>
        <p>Your order is still on process. Please try again later.</p>
      </div>
    );
  }

  if (orderStatus === "canceled") {
    return (
      <div className="w-full lg:w-1/2 p-4 rounded border border-destructive bg-destructive/10">
        <h1 className="font-semibold text-2xl text-destructive">
          Order Canceled!
        </h1>
        <p>Unfortunately, Your order is canceled.</p>
      </div>
    );
  }
}
