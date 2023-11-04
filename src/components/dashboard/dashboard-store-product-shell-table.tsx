"use client";

import type { Product } from "@/db/schema";
import DashboardStoreProductDataTable from "./dashboard-store-product-data-table";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";

const storeProductColumnHelper = createColumnHelper<Product>();

const columns = [
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
] as ColumnDef<Product>[];

interface DashboardStoreProductShellTableProps {
  storeProductData: Product[];
}

export default function DashboardStoreProductShellTable({
  storeProductData,
}: DashboardStoreProductShellTableProps) {
  return (
    <>
      <DashboardStoreProductDataTable
        storeProductColumnHelper={storeProductColumnHelper}
        columns={columns}
        data={storeProductData}
      />
    </>
  );
}
