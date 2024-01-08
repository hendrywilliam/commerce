import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs";
import type { UserObjectCustomized } from "@/types";
import PurchaseHistoryShellTable from "@/components/dashboard/purchases/purchase-history-shell-table";

export default async function DashboardPurchasesPage() {
  const user = (await currentUser()) as unknown as UserObjectCustomized;
  const intentHistories = (
    await stripe.paymentIntents.list({
      customer: user.privateMetadata.stripeCustomerId,
      limit: 10,
    })
  ).data as unknown as Stripe.PaymentIntent[];

  return (
    <div className="w-full">
      <h1 className="font-bold text-2xl">Purchase</h1>
      <p>Your purchase history stored here.</p>
      <PurchaseHistoryShellTable purchaseHistory={intentHistories} />
    </div>
  );
}
