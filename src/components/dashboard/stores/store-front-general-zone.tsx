"use client";

import { toast } from "sonner";
import { Store } from "@/db/schema";
import SeedButton from "./seed-button";
import { catchError } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconLoading } from "@/components/ui/icons";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState, useTransition } from "react";
import { updateOwnedStoreAction } from "@/actions/stores/update-store";
import { createAccountLinkAction } from "@/actions/stripe/create-account-link";

interface StorefrontGeneralZoneProps {
  store: Store;
}

export default function StorefrontGeneralZone({
  store,
}: StorefrontGeneralZoneProps) {
  const [previousStorePublicInformation, setPreviousStorePublicInformation] =
    useState(store);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [anyChangesCommited, setAnyChangesCommited] = useState(false);
  const [storePublicInformation, setStorePublicInformation] = useState(store);

  async function updateSelectedStore() {
    setIsLoading((isLoading) => !isLoading);
    await updateOwnedStoreAction({
      name: storePublicInformation.name,
      description: storePublicInformation.description,
      id: storePublicInformation.id,
    })
      .then((res) => {
        toast.success("Your store has been updated.");
      })
      .catch((err) => {
        catchError(err);
      })
      .finally(() => {
        setIsLoading((isLoading) => !isLoading);
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
    <div className="flex flex-col">
      <div className="flex flex-col justify-between gap-4">
        <div>
          <div className="inline-flex justify-between w-full">
            <Button
              disabled={store.active || isPending}
              aria-disabled={store.active ? "true" : "false"}
              onClick={() =>
                startTransition(async () => {
                  await createAccountLinkAction(store.id);
                })
              }
              className="inline-flex gap-2"
            >
              {isPending && <IconLoading />}
              Activate Store
            </Button>
          </div>
        </div>
        <div>
          <label htmlFor="store-name" className="font-bold">
            Store Name
          </label>
          <Input
            onChange={(e) =>
              setStorePublicInformation({
                ...storePublicInformation,
                name: e.target.value,
              })
            }
            name="store-name"
            value={storePublicInformation.name}
            className="border focus:ring-2 focus-visible:ring-muted outline-none disabled:opacity-75 w-1/4 mt-2"
          />
          <p className="text-gray-500 text-sm mt-2">
            This is your store unique identifier. It can be anything as long it
            does not contains any bad words.
          </p>
        </div>
        <div>
          <label htmlFor="store-description" className="font-bold">
            Store Description
          </label>
          <Textarea
            value={storePublicInformation.description}
            onChange={(e) =>
              setStorePublicInformation({
                ...storePublicInformation,
                description: e.target.value,
              })
            }
            name="store-description"
            className="border focus:ring-2 ring-muted focus-visible:ring-muted outline-none focus:outline-none p-2 disabled:opacity-75 h-56 w-1/2 rounded resize-none mt-2"
          />
          <p className="text-gray-500 text-sm mt-2">
            Use any appropriate words to describe this store. This is visible to
            public.
          </p>
        </div>
        <div className="mt-4">
          <Button
            disabled={isLoading || !anyChangesCommited}
            aria-disabled={isLoading || !anyChangesCommited ? "true" : "false"}
            className="inline-flex gap-2"
            onClick={updateSelectedStore}
          >
            {isLoading && <IconLoading />}
            Confirm Changes
          </Button>
        </div>
        {/* <SeedButton storeId={store.id} /> */}
      </div>
    </div>
  );
}
