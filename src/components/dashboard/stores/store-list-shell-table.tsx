"use client";

import { Store } from "@/db/schema";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import StoreListDataTable from "./store-list-data-table";
import NoResultMessage from "@/components/no-result-message";

interface Props {
  stores: Store[];
}

const storesHelper = createColumnHelper<Store>();

export default function StoreListShellTables({ stores }: Props) {
  const path = usePathname();
  const [rowSelection, setRowSelection] = useState({});
  const [rawRowDataSelection, setRawRowDataSelection] = useState<Store[]>([]);
  const columns = useMemo(
    () =>
      [
        storesHelper.accessor("id", {
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
      ] as ColumnDef<Store>[],
    [path],
  );

  return (
    <div>
      {stores.length > 0 ? (
        <StoreListDataTable
          columns={columns}
          data={stores}
          rawRowDataSelection={rawRowDataSelection}
          rowSelection={rowSelection}
          setRawRowData={setRawRowDataSelection}
          setRowSelection={setRowSelection}
        />
      ) : (
        <NoResultMessage />
      )}
    </div>
  );
}
