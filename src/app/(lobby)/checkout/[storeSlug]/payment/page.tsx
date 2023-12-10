import { redirect } from "next/navigation";
import PageLayout from "@/components/layouts/page-layout";
import { Checkout } from "@/components/lobby/checkout/checkout";

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const clientSecret = searchParams.client_secret;
  const paymentIntentId = searchParams.payment_intent_id;

  if (!paymentIntentId && !clientSecret) {
    redirect("/");
  }

  return (
    <PageLayout>
      <h1 className="font-semibold text-2xl">Checkout</h1>
      <section className="flex flex-col lg:flex-row gap-4">
        <div className="w-full">
          <Checkout clientSecret={clientSecret} />
        </div>
      </section>
    </PageLayout>
  );
}
