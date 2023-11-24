"use client";

import { useTransition } from "react";
import { useUser } from "@clerk/nextjs";
import type { Address } from "@/db/schema";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconLoading } from "@/components/ui/icons";
import { selectAddressAction } from "@/actions/addresses/select-address";

interface AddressCardProps {
  address: Address;
  selectedAddress?: Pick<Address, "id">["id"];
}

export default function AddressCard({
  address,
  selectedAddress,
}: AddressCardProps) {
  const [isPending, startTransition] = useTransition();
  const { user } = useUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="flex flex-col w-full border p-4 rounded">
      {selectedAddress === address.id && (
        <Badge variant="default" className="w-max mb-2">
          Selected Address
        </Badge>
      )}
      <div className="flex flex-col">
        <p>{address.line1}</p>
        <p>{address.line2}</p>
        <p>{address.country}</p>
        <p>{address.postal_code}</p>
        <p>{address.state}</p>
      </div>
      <div className="inline-flex justify-end">
        <Button
          disabled={isPending}
          aria-disabled={isPending ? "true" : "false"}
          className="inline-flex gap-2"
          onClick={() =>
            void startTransition(async () => {
              await selectAddressAction(address.id);
            })
          }
        >
          {isPending && <IconLoading />}
          Select Address
        </Button>
      </div>
    </div>
  );
}
