"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Orders } from "@/db/schema";
import { beautifyId } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import PurchaseHistoryDataTable from "./purchase-history-data-table";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";

interface PurchaseHistoryShellProps {
  purchaseHistory: Orders[];
}

const purchaseHistoryColumnHelper = createColumnHelper<Orders>();

export default function PurchaseHistoryShellTable({
  purchaseHistory,
}: PurchaseHistoryShellProps) {
  const pathname = usePathname();

  const columns = useMemo(
    () =>
      [
        purchaseHistoryColumnHelper.accessor("stripePaymentIntentId", {
          header: () => <span>Order ID</span>,
          cell: (info) => <span>{beautifyId(info.getValue() as string)}</span>,
          footer: (info) => info.column.id,
        }),
        purchaseHistoryColumnHelper.accessor("email", {
          header: () => <span>Email</span>,
          cell: (info) => info.getValue(),
          footer: (info) => info.column.id,
        }),
        purchaseHistoryColumnHelper.accessor("stripePaymentIntentStatus", {
          header: () => <span>Payment Status</span>,
          cell: (info) => info.getValue(),
          footer: (info) => info.column.id,
        }),
        purchaseHistoryColumnHelper.accessor("createdAt", {
          header: () => <span>Date</span>,
          cell: (info) => (
            <span>{(info.getValue() as Date).toUTCString()}</span>
          ),
          footer: (info) => info.column.id,
        }),
        purchaseHistoryColumnHelper.display({
          id: "purchase-details",
          cell: ({ row }) => {
            const data = row.original;
            const purchaseId = data.id;
            return (
              <Link
                className={buttonVariants()}
                href={`${pathname}/${purchaseId}`}
              >
                Detail
              </Link>
            );
          },
        }),
      ] as ColumnDef<Orders>[],
    [pathname],
  );

  return <PurchaseHistoryDataTable columns={columns} data={purchaseHistory} />;
}
