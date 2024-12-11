/* eslint-disable react-hooks/exhaustive-deps */
import {
  ColumnDef,
  RowSelectionState,
  useReactTable,
  getCoreRowModel,
  Row,
} from "@tanstack/react-table";
import { Dispatch, SetStateAction, useEffect } from "react";

interface UseDataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  rowSelection: RowSelectionState;
  setRawRowDataSelection: Dispatch<SetStateAction<T[]>>;
  setRowSelection: Dispatch<SetStateAction<Record<string, boolean>>>;
  enableRowSelection?: boolean | ((row: Row<T>) => boolean) | undefined;
}

export function useDataTable<T>({
  data,
  columns,
  rowSelection,
  setRowSelection,
  setRawRowDataSelection,
  enableRowSelection = true,
}: UseDataTableProps<T>) {
  const table = useReactTable<T>({
    data,
    columns,
    state: {
      rowSelection,
    },
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection,
    onRowSelectionChange: setRowSelection,
  });

  const selectedRawRowData = table
    .getSelectedRowModel()
    .flatRows.map((row) => row.original);

  useEffect(() => {
    setRawRowDataSelection(selectedRawRowData);
    return () => {};
  }, [rowSelection]);

  return { table };
}
