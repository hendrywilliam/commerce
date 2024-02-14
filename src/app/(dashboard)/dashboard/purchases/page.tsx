import { Orders } from "@/db/schema";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";
import Pagination from "@/components/pagination";
import type { UserObjectCustomized } from "@/types";
import { Separator } from "@/components/ui/separator";
import { get_purchase_history_fetcher } from "@/fetchers/purchase/get-purchase-history-and-pages";
import PurchaseHistoryShellTable from "@/components/dashboard/purchases/purchase-history-shell-table";

interface DashboardPurchasePageProps {
  searchParams: {
    page: string;
    status: Orders["stripePaymentIntentStatus"];
  };
}

export default async function DashboardPurchasePage({
  searchParams,
}: DashboardPurchasePageProps) {
  const user = (await currentUser()) as unknown as UserObjectCustomized;

  if (!user) {
    redirect("/sign-in");
  }

  const page =
    Number(searchParams.page) === 0 || isNaN(Number(searchParams.page))
      ? 1
      : Number(searchParams.page);
  const status =
    searchParams.status &&
    ["succeeded", "processing", "canceled"].includes(searchParams.status)
      ? searchParams.status
      : "succeeded";
  const pageSize = 10;

  const { orderHistory, count: totalPage } = await get_purchase_history_fetcher(
    {
      page,
      pageSize,
      status,
    },
  );

  return (
    <div className="w-full">
      <h1 className="font-bold text-2xl">Purchase</h1>
      <p className="text-gray-500">Your purchase history stored here.</p>
      <Separator />
      <PurchaseHistoryShellTable purchaseHistory={orderHistory} />
      <div>
        <Pagination currentPage={page} totalPage={totalPage} />
      </div>
    </div>
  );
}
