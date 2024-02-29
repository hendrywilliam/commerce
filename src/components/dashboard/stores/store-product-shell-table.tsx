"use client";

import Link from "next/link";
import Image from "next/image";
import { UploadData } from "@/types";
import { useState, useMemo } from "react";
import type { Product } from "@/db/schema";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { buttonVariants } from "@/components/ui/button";
import { ArrowOutwardIcon } from "@/components/ui/icons";
import { formatCurrency, parse_to_json } from "@/lib/utils";
import ImagePlaceholder from "@/components/image-placeholder";
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
        storeProductColumnHelper.accessor("image", {
          header: () => "Image",
          cell: (info) => {
            const parsedImage = parse_to_json<UploadData[]>(
              info.getValue() as string,
            )[0];
            return (
              <div className="relative w-9 h-9 border rounded">
                {parsedImage ? (
                  <Image
                    src={parsedImage.url}
                    alt={parsedImage.name}
                    fill
                    style={{
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <ImagePlaceholder />
                )}
              </div>
            );
          },
          footer: (info) => info.column.id,
        }),
        storeProductColumnHelper.accessor("name", {
          header: () => "Name",
          cell: (info) => (
            <span className="font-medium">{info.getValue()}</span>
          ),
          footer: (info) => info.column.id,
        }),
        storeProductColumnHelper.accessor("stock", {
          header: () => "Status",
          cell: (info) => {
            const stockAvailable = info.getValue() > 0;
            return (
              <>
                {stockAvailable ? (
                  <Badge className="bg-green-200 border-green-300 text-green-500">
                    Available
                  </Badge>
                ) : (
                  <Badge className="bg-destructive/20 border-destructive/40 text-destructive/60">
                    Out of stock
                  </Badge>
                )}
              </>
            );
          },
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
        storeProductColumnHelper.accessor("averageRatings", {
          header: () => "Rating",
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
        setRawRowDataSelection={setRawRowDataSelection}
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
