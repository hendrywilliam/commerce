import { Checkout } from "@/components/lobby/checkout/checkout";
import { redirect } from "next/navigation";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const productId = searchParams.id;
  const clientSecret = searchParams.client_secret;

  if (!productId && !clientSecret) {
    redirect("/");
  }

  return (
    <div className="flex flex-col container h-full w-full py-8 gap-4">
      <h1 className="font-semibold text-2xl">Checkout</h1>
      <section className="flex flex-col lg:flex-row gap-4">
        <Checkout id={productId} clientSecret={clientSecret} />
        <div className="w-full lg:w-1/4"></div>
      </section>
    </div>
  );
}
