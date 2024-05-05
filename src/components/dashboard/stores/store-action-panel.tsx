"use client";

import { toast } from "sonner";
import { useState } from "react";
import { Payment, Store } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { TrashcanIcon } from "@/components/ui/icons";
import { setStoreStatusAction } from "@/actions/stores/set-store-status";
import { createAccountLinkAction } from "@/actions/stripe/create-account-link";

interface Props {
  store: Store;
  payment?: Payment | undefined;
}

export default function StoreActionPanel({ store, payment }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const setStoreStatus = async () => {
    setIsLoading(true);
    toast.promise(
      setStoreStatusAction({
        store_id: store.id,
      }),
      {
        loading: store.active
          ? "Closing your store..."
          : "Opening your store...",
        success: () => {
          return !store.active ? "Store is open." : "Store is closed.";
        },
        error(error) {
          return (error as Error).message ?? "Something went wrong.";
        },
        finally: () => {
          setIsLoading(false);
        },
      },
    );
  };

  const addPaymentToStore = async () => {
    setIsLoading(true);
    toast.promise(createAccountLinkAction(store.id), {
      loading: "Adding payment channel to your store...",
    });
  };

  return (
    <div className="flex justify-end gap-2">
      <Button
        onClick={addPaymentToStore}
        variant="outline"
        disabled={Boolean(payment) || isLoading}
      >
        Activate Store
      </Button>
      <Button disabled={isLoading} onClick={setStoreStatus} variant="outline">
        {store.active ? "Close Store" : "Open Store"}
      </Button>
      <Button disabled={isLoading} variant="outline" size="icon">
        <TrashcanIcon />
      </Button>
    </div>
  );
}
