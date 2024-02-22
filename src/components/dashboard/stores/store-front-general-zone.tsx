"use client";

import { Store } from "@/db/schema";
import { useTransition } from "react";
import SeedButton from "./seed-button";
import { Button } from "@/components/ui/button";
import { IconLoading } from "@/components/ui/icons";
import StoreForm from "@/components/dashboard/stores/store-form";
import { createAccountLinkAction } from "@/actions/stripe/create-account-link";

interface StorefrontGeneralZoneProps {
  store: Store;
}

export default function StorefrontGeneralZone({
  store,
}: StorefrontGeneralZoneProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-col">
      <div className="flex flex-col justify-between gap-4">
        <Button
          disabled={store.active || isPending}
          aria-disabled={store.active ? "true" : "false"}
          onClick={() =>
            startTransition(async () => {
              await createAccountLinkAction(store.id);
            })
          }
          className="inline-flex gap-2 w-max"
        >
          {isPending && <IconLoading />}
          Activate Store
        </Button>
        <StoreForm
          storeStatus="existing-store"
          initialValue={{
            id: store.id,
            name: store.name,
            description: store.description,
          }}
        />
        <SeedButton storeId={store.id} />
      </div>
    </div>
  );
}
