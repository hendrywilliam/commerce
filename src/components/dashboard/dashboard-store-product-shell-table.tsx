"use client";

import type { Product } from "@/db/schema";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useMemo } from "react";
import DashboardStoreProductDataTable from "./dashboard-store-product-data-table";
import DashboardStoreProductDataTableAction from "./dashboard-store-product-data-table-action";

const storeProductColumnHelper = createColumnHelper<Product>();

interface DashboardStoreProductShellTableProps {
  storeProductData: Product[];
}

export default function DashboardStoreProductShellTable({
  storeProductData,
}: DashboardStoreProductShellTableProps) {
  const [rowSelection, setRowSelection] = useState({});
  const [rawRowDataSelection, setRawRowDataSelection] = useState<Product[]>([]);
  const columns = useMemo(
    () =>
      [
        storeProductColumnHelper.accessor("id", {
          header: ({ table }) => (
            <div className="py-1">
              <Checkbox
                checked={table.getIsAllRowsSelected()}
                onClick={table.getToggleAllRowsSelectedHandler()}
              />
            </div>
          ),
          cell: ({ row }) => (
            <div className="py-1">
              <Checkbox
                checked={row.getIsSelected()}
                onClick={row.getToggleSelectedHandler()}
                disabled={!row.getCanSelect()}
              />
            </div>
          ),
        }),
        storeProductColumnHelper.accessor("name", {
          header: () => "Name",
          cell: (info) => info.getValue(),
          footer: (info) => info.column.id,
        }),
        storeProductColumnHelper.accessor("price", {
          header: () => "Price",
          cell: (info) => info.getValue(),
          footer: (info) => info.column.id,
        }),
        storeProductColumnHelper.accessor("category", {
          header: () => "Category",
          cell: (info) => info.renderValue(),
          footer: (info) => info.column.id,
        }),
        storeProductColumnHelper.accessor("rating", {
          header: () => "Rating",
          cell: (info) => info.renderValue(),
          footer: (info) => info.column.id,
        }),
        storeProductColumnHelper.accessor("stock", {
          header: () => "Stock",
          cell: (info) => info.renderValue(),
          footer: (info) => info.column.id,
        }),
      ] as ColumnDef<Product>[],
    []
  );

  return (
    <>
      <DashboardStoreProductDataTableAction
        rawRowDataSelection={rawRowDataSelection}
      />
      <DashboardStoreProductDataTable
        columns={columns}
        data={storeProductData}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        setRawRowDataSelection={setRawRowDataSelection}
        rawRowDataSelection={rawRowDataSelection}
      />
    </>
  );
}
