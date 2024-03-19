"use client";

import { Store } from "@/db/schema";
import { toast } from "sonner";
import { seedProducts } from "@/actions/seed";
import { Button } from "@/components/ui/button";
import { catchError } from "@/lib/utils";

interface SeedButtonProps {
  storeId: Store["id"];
}

export default function SeedButton({ storeId }: SeedButtonProps) {
  async function seedStoreProducts() {
    toast.promise(seedProducts({ storeId: storeId }), {
      loading: "Seeding your store...",
      success: () => "Seeding completed.",
      error: (error) => catchError(error),
    });
  }

  return <Button onClick={seedStoreProducts}>Seed Products</Button>;
}
