"use client";

import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useMemo } from "react";
import { beautifyId } from "@/lib/utils";
import type { Orders } from "@/db/schema";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import OrdersHistoryDataTable from "@/components/dashboard/stores/orders/orders-history-data-table";
import OrdersHistoryDataTableToolbar from "@/components/dashboard/stores/orders/orders-history-data-table-toolbar";

const storeOrdersColumnHelper = createColumnHelper<Orders>();

interface OrdersHistoryShellTableProps {
  orders: Orders[];
}

export default function OrdersHistoryShellTable({
  orders,
}: OrdersHistoryShellTableProps) {
  const pathname = usePathname();

  const columns = useMemo(
    () =>
      [
        storeOrdersColumnHelper.accessor("stripePaymentIntentId", {
          header: () => "Payment ID",
          cell: (info) => <span>{beautifyId(String(info.getValue()))}</span>,
          footer: (info) => info.column.id,
        }),
        storeOrdersColumnHelper.accessor("name", {
          header: () => "Customer Name",
          cell: (info) => (
            <span className="font-medium">{info.getValue()}</span>
          ),
          footer: (info) => info.column.id,
        }),
        storeOrdersColumnHelper.accessor("stripePaymentIntentStatus", {
          header: () => "Payment Status",
          cell: (info) => <span>{info.getValue()}</span>,
          footer: (info) => info.column.id,
        }),
        storeOrdersColumnHelper.accessor("email", {
          header: () => "Customer Email",
          cell: (info) => <span>{info.getValue()}</span>,
          footer: (info) => info.column.id,
        }),
        storeOrdersColumnHelper.accessor("createdAt", {
          header: () => "Date",
          cell: (info) => (
            <span>
              {info.getValue()?.toLocaleDateString("us-US", {
                dateStyle: "full",
              })}
            </span>
          ),
          footer: (info) => info.column.id,
        }),
        storeOrdersColumnHelper.display({
          id: "order-details",
          cell: ({ row }) => {
            const data = row.original;
            const orderId = data.id;
            return (
              <Link
                href={`${pathname}/${orderId}`}
                className={buttonVariants()}
              >
                Details
              </Link>
            );
          },
        }),
      ] as ColumnDef<Orders>[],
    [pathname],
  );

  return (
    <>
      <OrdersHistoryDataTableToolbar />
      <OrdersHistoryDataTable columns={columns} data={orders} />
    </>
  );
}
