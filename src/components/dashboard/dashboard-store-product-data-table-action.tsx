"use client";

import { Button } from "@/components/ui/button";
import { Product } from "@/db/schema";
import { IconTrashCan } from "@/components/ui/icons";
import { deleteStoreProductsAction } from "@/actions/products/delete-store-products";
import { catchError } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { IconLoading } from "@/components/ui/icons";

interface DashboardStoreProductDataTableActionProps {
  rawRowDataSelection: Product[];
}

export default function DashboardStoreProductDataTableAction({
  rawRowDataSelection,
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
      }
    } else {
      toast.error("Please select any product to delete.");
    }
  }

  return (
    <div className="flex w-full my-4 h-10 justify-end">
      {rawRowDataSelection.length > 0 && (
        <Button
          disabled={isLoading}
          aria-disabled={isLoading}
          onClick={deleteProductsInOwnedStore}
          className="flex gap-2"
        >
          Delete {isLoading ? <IconLoading /> : <IconTrashCan />}
        </Button>
      )}
    </div>
  );
}
