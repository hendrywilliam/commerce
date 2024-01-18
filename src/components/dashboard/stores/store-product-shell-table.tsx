"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import type { Product } from "@/db/schema";
import { formatCurrency } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { buttonVariants } from "@/components/ui/button";
import { ArrowOutwardIcon } from "@/components/ui/icons";
import DashboardStoreProductDataTable from "./store-product-data-table";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import DashboardStoreProductDataTableAction from "./store-product-data-table-action";

const storeProductColumnHelper = createColumnHelper<Product>();

interface DashboardStoreProductShellTableProps {
  storeProductData: Product[];
}

export default function DashboardStoreProductShellTable({
  storeProductData,
}: DashboardStoreProductShellTableProps) {
  const pathname = usePathname();
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
          cell: (info) => (
            <span>{formatCurrency(Number(info.getValue()))}</span>
          ),
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
        storeProductColumnHelper.display({
          id: "product-link",
          cell: ({ row }) => {
            const data = row.original;
            const slug = data.slug;
            return (
              <Link
                href={`${pathname}/edit-product/${slug}`}
                className={buttonVariants({ size: "icon" })}
              >
                <ArrowOutwardIcon />
              </Link>
            );
          },
        }),
      ] as ColumnDef<Product>[],
    [pathname],
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
