"use client";

import { toast } from "sonner";
import { useState } from "react";
import { Store } from "@/db/schema";
import { catchError } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IconLoading } from "@/components/ui/icons";
import { delete_owned_store_action } from "@/actions/stores/delete-owned-store";

interface StorefrontDangerZone {
  storeId: Store["id"];
}

export default function StorefrontDangerZone({
  storeId,
}: StorefrontDangerZone) {
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmedToDelete, setIsConfirmedToDelete] = useState(false);

  async function delete_store() {
    setIsDisabled((isDisabled) => !isDisabled);
    setIsLoading((isLoading) => !isLoading);
    try {
      await delete_owned_store_action(storeId);
      toast.success("Store deleted successfully.");
    } catch (err) {
      catchError(err);
    } finally {
      setIsDisabled((isDisabled) => !isDisabled);
      setIsLoading((isLoading) => !isLoading);
      setIsConfirmedToDelete(false);
    }
  }

  return (
    <div className="flex flex-col text-sm mt-4 gap-1">
      <h1 className="font-bold text-xl text-destructive">Danger Zone</h1>
      <div className="flex border border-destructive rounded p-2 justify-between">
        <div>
          <p className="font-bold text-destructive">Delete this store</p>
          <p className="text-destructive">
            Once you delete a store, there is no way to revert this action. Do
            it with cautious.
          </p>
        </div>
        <div>
          {isConfirmedToDelete ? (
            <Button
              className="flex gap-1"
              onClick={delete_store}
              variant={"destructive"}
              disabled={isDisabled}
            >
              {isLoading && <IconLoading />}
              Confirm?
            </Button>
          ) : (
            <Button
              variant={"destructive"}
              onClick={() => void setIsConfirmedToDelete((val) => !val)}
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
