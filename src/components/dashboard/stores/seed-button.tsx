"use client";

import { useTransition } from "react";
import { catchError } from "@/lib/utils";
import { seed_products } from "@/actions/seed";
import { Button } from "@/components/ui/button";
import { IconLoading } from "@/components/ui/icons";
import { toast } from "sonner";

interface SeedButtonProps {
  storeId: number;
}

export default function SeedButton({ storeId }: SeedButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      onClick={() => {
        startTransition(async () => {
          try {
            await seed_products({ storeId, count: 10 });
            toast.success("Seeding completed.");
          } catch (error) {
            catchError(error);
          }
        });
      }}
      className="inline-flex gap-2 w-max"
      disabled={isPending}
      aria-disabled={isPending ? "true" : "false"}
    >
      {isPending && <IconLoading />}
      Seed Products
    </Button>
  );
}
