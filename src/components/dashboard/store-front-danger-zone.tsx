"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { deleteOwnedStore } from "@/actions/stores/delete-owned-store";
import { useState } from "react";
import { catchError } from "@/lib/utils";
import { IconLoading } from "@/components/ui/icons";

interface DashboardStoreFrontDangerZoneProps {
  id: number;
}

export default function DashboardStoreFrontDangerZone({
  id,
}: DashboardStoreFrontDangerZoneProps) {
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmedToDelete, setIsConfirmedToDelete] = useState(false);

  async function deleteThisStore() {
    setIsDisabled((isDisabled) => !isDisabled);
    setIsLoading((isLoading) => !isLoading);
    try {
      await deleteOwnedStore(id);
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
    <div className="flex flex-col mt-4 gap-1">
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
              onClick={deleteThisStore}
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
