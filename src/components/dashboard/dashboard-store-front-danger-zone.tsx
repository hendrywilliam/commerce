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
    setIsDisabled((val) => !val);
    setIsLoading((val) => !val);
    try {
      await deleteOwnedStore(id);
      toast("Success delete your store.");
    } catch (err) {
      catchError(err);
    } finally {
      setIsDisabled((val) => !val);
      setIsLoading((val) => !val);
      setIsConfirmedToDelete(false);
    }
  }

  return (
    <div className="flex flex-col mt-4 gap-1">
      <h1 className="font-bold text-xl text-destructive">Danger Zone</h1>
      <div className="flex border border-destructive rounded p-2 bg-destructive/10 justify-between">
        <div>
          <p className="font-bold text-destructive">Delete this store</p>
          <p>
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
