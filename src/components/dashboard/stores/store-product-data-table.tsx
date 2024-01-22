"use client";

import {
  Table,
  TableBody,
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
import type { Product } from "@/db/schema";
import { Dispatch, SetStateAction, useEffect } from "react";

interface DashboardStoreProductDataTableProps {
  data: Product[];
  columns: ColumnDef<Product>[];
  rowSelection: RowSelectionState;
  rawRowDataSelection: Product[];
  setRowSelection: Dispatch<SetStateAction<Record<string, boolean>>>;
  setRawRowDataSelection: Dispatch<SetStateAction<Product[]>>;
}

export default function DashboardStoreProductDataTable({
  data,
  columns,
  rowSelection,
  setRowSelection,
  setRawRowDataSelection,
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
    <Table>
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
  );
}
