import Stripe from "stripe";
import { CheckmarkOrderStatusIcon } from "@/components/ui/icons";

interface OrderStatusProps {
  orderStatus: Stripe.PaymentIntent.Status;
}

export default function OrderStatus({ orderStatus }: OrderStatusProps) {
  if (orderStatus === "succeeded") {
    return (
      <div className="flex w-full justify-center text-center">
        <div className="flex flex-col w-full lg:w-1/2 p-4 items-center">
          <CheckmarkOrderStatusIcon className="w-[2em] h-[2em]" />
          <h1 className="font-semibold text-2xl">Payment Succeeded!</h1>
          <p>
            Thank you for your purchase. Your items will be delivered next to
            your door.
          </p>
        </div>
      </div>
    );
  }

  if (orderStatus === "processing") {
    return (
      <div className="flex w-full justify-center text-center">
        <div className="w-full lg:w-1/2 p-4">
          <h1 className="font-semibold text-2xl ">Heads up!</h1>
          <p>Your order is still on process. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (orderStatus === "canceled") {
    return (
      <div className="flex w-full justify-center text-center">
        <div className="w-full lg:w-1/2 p-4">
          <h1 className="font-semibold text-2xl ">Order Canceled!</h1>
          <p>Unfortunately, Your order is canceled.</p>
        </div>
      </div>
    );
  }
}
