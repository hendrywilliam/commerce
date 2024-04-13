"use client";

import { useTransition } from "react";
import { catchError } from "@/lib/utils";
import { seedProducts } from "../../../../scripts/seed";
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
            await seedProducts({ storeId, count: 10 });
            toast.success("Seeding completed.");
          } catch (error) {
            catchError(error);
          }
        });
      }}
      className="inline-flex w-max gap-2"
      disabled={isPending}
      aria-disabled={isPending ? "true" : "false"}
    >
      {isPending && <IconLoading />}
      Seed Products
    </Button>
  );
}
