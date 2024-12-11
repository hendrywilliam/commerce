import React, { Dispatch, SetStateAction } from "react";
import { useDataTable } from "@/hooks/use-data-table";

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
import { Store } from "@/db/schema";

interface Props {
  data: Store[];
  columns: ColumnDef<Store>[];
  rowSelection: RowSelectionState;
  rawRowDataSelection: Store[];
  setRawRowData: Dispatch<SetStateAction<Store[]>>;
  setRowSelection: Dispatch<SetStateAction<Record<string, boolean>>>;
}

export default function StoreListDataTable({
  columns,
  data,
  rowSelection,
  setRawRowData,
  setRowSelection,
}: Props) {
  const { table } = useDataTable<Store>({
    columns,
    data,
    setRowSelection,
    rowSelection,
    setRawRowDataSelection: setRawRowData,
  });

  return (
    <div className="rounded border">
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
    </div>
  );
}
