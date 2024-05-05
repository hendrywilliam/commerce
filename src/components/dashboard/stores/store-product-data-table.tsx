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
} from "@tanstack/react-table";
import type { Product } from "@/db/schema";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useDataTable } from "@/hooks/use-data-table";

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
  const { table } = useDataTable<Product>({
    data,
    columns,
    setRowSelection,
    rowSelection,
    setRawRowDataSelection,
  });

  return (
    <Table className="table-auto">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
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
        {table.getRowModel().rows.map((row) => (
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
