"use client";

import { Store } from "@/db/schema";
import { useTransition } from "react";
import { catchError } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IconLoading, ArrowOutwardIcon } from "@/components/ui/icons";
import { createAccountLinkAction } from "@/actions/stripe/create-account-link";

interface ActivateButtonProps {
  storeId: Store["id"];
  isActive: Store["active"];
}

export default function ActivateStoreButton({
  storeId,
  isActive,
}: ActivateButtonProps) {
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      variant="outline"
      className="inline-flex gap-1"
      disabled={isActive}
      onClick={() => {
        startTransition(async () => {
          try {
            if (!isActive) {
              await createAccountLinkAction(storeId);
            }
            return;
          } catch (error) {
            catchError(error);
          }
        });
      }}
    >
      Activate
      {isPending ? <IconLoading /> : <ArrowOutwardIcon />}
    </Button>
  );
}
