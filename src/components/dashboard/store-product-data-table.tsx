"use client";

import type { Product } from "@/db/schema";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  RowSelectionState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction, useEffect } from "react";

interface DashboardStoreProductDataTableProps {
  data: Product[];
  columns: ColumnDef<Product>[];
  rowSelection: RowSelectionState;
  rawRowDataSelection: Product[];
  // The pattern is id:true / id:false
  setRowSelection: Dispatch<SetStateAction<Record<string, boolean>>>;
  setRawRowDataSelection: Dispatch<SetStateAction<Product[]>>;
}

export default function DashboardStoreProductDataTable({
  data,
  columns,
  rowSelection,
  setRowSelection,
  setRawRowDataSelection,
  rawRowDataSelection,
}: DashboardStoreProductDataTableProps) {
  const productDataTable = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
    },
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
  });

  // Select original data from the table.
  const selectedRawRowData = productDataTable
    .getSelectedRowModel()
    .flatRows.map((row) => row.original);

  useEffect(() => {
    setRawRowDataSelection(selectedRawRowData);
    // eslint-disable-next-line
  }, [rowSelection]);

  return (
    <>
      <Table>
        <TableCaption>All your products in the store.</TableCaption>
        <TableHeader>
          {productDataTable.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {productDataTable.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
