"use client";

import { toast } from "sonner";
import { Store } from "@/db/schema";
import { catchError } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconLoading } from "@/components/ui/icons";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState, useTransition } from "react";
import { updateOwnedStoreAction } from "@/actions/stores/update-store";
import { createPayoutAccountAction } from "@/actions/users/create-payout-account";

interface DashboardStoreFrontGeneralZoneProps {
  store: Store;
}

export default function DashboardStoreFrontGeneralZone({
  store,
}: DashboardStoreFrontGeneralZoneProps) {
  // double state mirroring
  const [previousStorePublicInformation, setPreviousStorePublicInformation] =
    useState(store);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [anyChangesCommited, setAnyChangesCommited] = useState(false);
  const [storePublicInformation, setStorePublicInformation] = useState(store);

  async function updateSelectedStore() {
    setIsLoading((value) => !value);
    await updateOwnedStoreAction({
      name: storePublicInformation.name,
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
      <h1 className="font-bold text-xl">General</h1>
      <div className="flex flex-col py-2 justify-between gap-4">
        <div>
          <p className="font-bold">Activate Your Store</p>
          <div className="inline-flex justify-between w-full">
            <p>
              Your store status is:{" "}
              <span className="font-semibold">
                {store.active ? "Active" : "Not Active"}
              </span>
            </p>
            <Button
              disabled={store.active || isPending}
              aria-disabled={store.active ? "true" : "false"}
              onClick={() =>
                startTransition(async () => {
                  await createPayoutAccountAction(store.id);
                })
              }
              className="inline-flex gap-2"
            >
              {isPending && <IconLoading />}
              Activate
            </Button>
          </div>
        </div>
        <div>
          <p className="font-bold">Store name</p>
          <p>
            Rename your own store into more recognizeable name, so you can
            compete against your competitor.
          </p>
          <Input
            onChange={(e) =>
              setStorePublicInformation({
                ...storePublicInformation,
                name: e.target.value,
              })
            }
            value={storePublicInformation.name}
            className="border focus:ring-2 focus-visible:ring-muted outline-none disabled:opacity-75 w-1/4 mt-2"
          />
        </div>
        <div>
          <p className="font-bold">Store description</p>
          <p>Explain your cool ass store to the world.</p>
          <Textarea
            value={storePublicInformation.description}
            onChange={(e) =>
              setStorePublicInformation({
                ...storePublicInformation,
                description: e.target.value,
              })
            }
            className="border focus:ring-2 ring-muted focus-visible:ring-muted outline-none focus:outline-none p-2 disabled:opacity-75 h-56 w-1/2 rounded resize-none mt-2"
          />
        </div>
        <div className="flex justify-end mt-4">
          {anyChangesCommited && (
            <Button
              disabled={isLoading}
              aria-disabled={isLoading ? "true" : "false"}
              className="inline-flex gap-2"
              onClick={updateSelectedStore}
            >
              Confirm Changes
              {isLoading && <IconLoading />}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
