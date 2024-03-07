import Link from "next/link";
import { Order } from "@/db/schema";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";
import Pagination from "@/components/pagination";
import { PurchaseIcon } from "@/components/ui/icons";
import type { UserObjectCustomized } from "@/types";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/components/ui/button";
import { get_purchase_history_fetcher } from "@/fetchers/purchase/get-purchase-history-and-pages";
import PurchaseHistoryShellTable from "@/components/dashboard/purchases/purchase-history-shell-table";

interface DashboardPurchasePageProps {
  searchParams: {
    page: string;
    status: Order["stripePaymentIntentStatus"];
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
      {orderHistory.length > 0 ? (
        <>
          <PurchaseHistoryShellTable purchaseHistory={orderHistory} />
          <div className="mt-4">
            {orderHistory.length > 0 && totalPage && (
              <Pagination currentPage={page} totalPage={totalPage} />
            )}
          </div>
        </>
      ) : (
        <div className="mt-4 flex w-full flex-col items-center justify-center gap-4 rounded border p-6 py-24 text-center shadow-sm">
          <PurchaseIcon className="h-6 w-6" />
          <h1 className="text-2xl">
            Your purchase history is currently empty.
          </h1>
          <p className="text-gray-500">Purchase a product to get started</p>
          <Link
            className={buttonVariants({
              variant: "outline",
            })}
            href="/products"
            target="_blank"
          >
            Get Started
          </Link>
        </div>
      )}
    </div>
  );
}
