"use client";

import Stripe from "stripe";
import { useMemo } from "react";
import PurchaseHistoryDataTable from "./purchase-history-data-table";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";

interface PurchaseHistoryShellProps {
  purchaseHistory: Stripe.PaymentIntent[];
}

const purchaseHistoryColumnHelper = createColumnHelper<Stripe.PaymentIntent>();

export default function PurchaseHistoryShellTable({
  purchaseHistory,
}: PurchaseHistoryShellProps) {
  const columns = useMemo(
    () =>
      [
        purchaseHistoryColumnHelper.accessor("id", {
          header: () => <span>ID</span>,
          cell: (info) => info.getValue(),
          footer: (info) => info.column.id,
        }),
        purchaseHistoryColumnHelper.accessor("amount", {
          header: () => <span>Order Amount</span>,
          cell: (info) => info.getValue(),
          footer: (info) => info.column.id,
        }),
      ] as ColumnDef<Stripe.PaymentIntent>[],
    [],
  );

  return (
    <PurchaseHistoryDataTable columns={columns} dataTable={purchaseHistory} />
  );
}
