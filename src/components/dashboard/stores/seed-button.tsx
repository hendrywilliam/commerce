"use client";

import { useTransition } from "react";
import { seed_products } from "@/actions/seed";
import { Button } from "@/components/ui/button";
import { IconLoading } from "@/components/ui/icons";

interface SeedButtonProps {
  storeId: number;
}

export default function SeedButton({ storeId }: SeedButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      onClick={() => {
        startTransition(async () => {
          await seed_products({ storeId, count: 10 });
        });
      }}
      className="inline-flex gap-2"
      disabled={isPending}
      aria-disabled={isPending ? "true" : "false"}
    >
      {isPending && <IconLoading />}
      Seed Products
    </Button>
  );
}
