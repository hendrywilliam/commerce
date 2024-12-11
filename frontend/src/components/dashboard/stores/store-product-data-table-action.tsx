"use client";

import { toast } from "sonner";
import { Product } from "@/db/schema";
import { catchError } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TrashcanIcon, IconLoading } from "@/components/ui/icons";
import { type Dispatch, type SetStateAction, useState } from "react";
import { deleteStoreProductsAction } from "@/actions/products/delete-store-products";

interface DashboardStoreProductDataTableActionProps {
  rawRowDataSelection: Product[];
  setRawRowDataSelection: Dispatch<SetStateAction<Product[]>>;
}

export default function DashboardStoreProductDataTableAction({
  rawRowDataSelection,
  setRawRowDataSelection,
}: DashboardStoreProductDataTableActionProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function deleteProductsInOwnedStore() {
    setIsLoading((isLoading) => !isLoading);
    if (rawRowDataSelection.length > 0) {
      try {
        await deleteStoreProductsAction(rawRowDataSelection);
        toast.success("Product(s) has been deleted.");
      } catch (err) {
        catchError(err);
      } finally {
        setIsLoading((isLoading) => !isLoading);
        setRawRowDataSelection([]);
      }
    } else {
      toast.error("Please select any product to delete.");
    }
  }

  return (
    <div className="my-4 flex h-10 w-full justify-end">
      <Button
        disabled={isLoading || !!!rawRowDataSelection.length}
        aria-disabled={isLoading || !!!rawRowDataSelection.length}
        onClick={deleteProductsInOwnedStore}
        className="flex gap-2"
      >
        {isLoading ? <IconLoading /> : <TrashcanIcon />}
        Delete
      </Button>
    </div>
  );
}
