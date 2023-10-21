"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { Store } from "@/db/schema";
import { Input } from "@/components/ui/input";
import { updateOwnedStoreAction } from "@/actions/stores/update-store";
import { toast } from "sonner";
import { catchError } from "@/lib/utils";
import { IconLoading } from "@/components/ui/icons";

interface DashboardStoreFrontGeneralZoneProps {
  store: Store;
}

export default function DashboardStoreFrontGeneralZone({
  store,
}: DashboardStoreFrontGeneralZoneProps) {
  // double state mirroring
  const [previousStorePublicInformation, setPreviousStorePublicInformation] =
    useState(store);
  const [storePublicInformation, setStorePublicInformation] = useState(store);
  const [anyChangesCommited, setAnyChangesCommited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function updateSelectedStore() {
    setIsLoading((value) => !value);
    await updateOwnedStoreAction({
      name: storePublicInformation.name,
      active: storePublicInformation.active,
      description: storePublicInformation.description,
      id: storePublicInformation.id,
    })
      .then((res) => {
        toast("Your store has been updated.");
      })
      .catch((err) => {
        catchError(err);
      })
      .finally(() => {
        setIsLoading((value) => !value);
      });
  }

  useEffect(() => {
    // compare two different object
    if (
      JSON.stringify(previousStorePublicInformation) !==
      JSON.stringify(storePublicInformation)
    ) {
      setAnyChangesCommited(true);
    }

    return () => setAnyChangesCommited(false);
  }, [storePublicInformation, previousStorePublicInformation]);

  return (
    <div className="flex flex-col mt-4 gap-1">
      <h1 className="font-bold text-xl border-b">General</h1>
      <div className="flex flex-col py-2 justify-between gap-4">
        <div>
          <p className="font-bold">Store name</p>
          <p>
            Rename your own store into more recognizeable name, so you can
            standoff against your competitor.
          </p>
          <Input
            onChange={(e) =>
              setStorePublicInformation({
                ...storePublicInformation,
                name: e.target.value,
              })
            }
            value={storePublicInformation.name}
            className="border focus:ring-2 focus-visible:ring-muted outline-none disabled:opacity-75 bg-muted w-1/4 mt-2"
          />
        </div>
        <div>
          <p className="font-bold">Store description</p>
          <p>Explain your cool ass store to the world.</p>
          <textarea
            value={storePublicInformation.description}
            onChange={(e) =>
              setStorePublicInformation({
                ...storePublicInformation,
                description: e.target.value,
              })
            }
            className="border focus:ring-2 ring-muted outline-none p-2 disabled:opacity-75 bg-muted w-1/2 rounded resize-none mt-2"
          />
        </div>
        <div className="inline-flex w-full justify-between">
          <div>
            <p className="font-bold">Activate/deactivate store</p>
            <p>You can choose to deactivate or activate your own store.</p>
          </div>
          <Switch
            checked={storePublicInformation.active}
            onCheckedChange={() =>
              setStorePublicInformation({
                ...storePublicInformation,
                active: !storePublicInformation.active,
              })
            }
          />
        </div>
        <div className="flex justify-end mt-4">
          {anyChangesCommited && (
            <Button className="inline-flex gap-2" onClick={updateSelectedStore}>
              Confirm Changes
              {isLoading && <IconLoading />}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
