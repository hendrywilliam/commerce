"use client";

import Link from "next/link";
import { useMemo } from "react";
import { beautifyId } from "@/lib/utils";
import type { Order } from "@/db/schema";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import OrdersHistoryDataTable from "@/components/dashboard/stores/orders/orders-history-data-table";
import OrdersHistoryActionPanel from "@/components/dashboard/stores/orders/orders-history-action-panel";

const storeOrdersColumnHelper = createColumnHelper<Order>();

interface OrdersHistoryShellTableProps {
  orders: Order[];
  showActionPanel?: boolean;
}

export default function OrdersHistoryShellTable({
  orders,
  showActionPanel = true,
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
          cell: (info) => <span>{info.getValue()?.toUTCString()}</span>,
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
      ] as ColumnDef<Order>[],
    [pathname],
  );

  return (
    <>
      {showActionPanel && <OrdersHistoryActionPanel />}
      <OrdersHistoryDataTable columns={columns} data={orders} />
    </>
  );
}
