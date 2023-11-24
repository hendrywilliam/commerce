"use client";

import { useUser } from "@clerk/nextjs";
import type { Address } from "@/db/schema";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { IconLoading, IconTrashCan } from "@/components/ui/icons";
import { selectAddressAction } from "@/actions/addresses/select-address";
import { deleteExistingAddressAction } from "@/actions/addresses/delete-existing-address";
import { toast } from "sonner";
import { catchError } from "@/lib/utils";

interface AddressCardProps {
  address: Address;
  selectedAddress?: Pick<Address, "id">["id"];
}

export default function AddressCard({
  address,
  selectedAddress,
}: AddressCardProps) {
  const { user } = useUser();
  const [isPending, startTransition] = useTransition();
  const [isDeletingAddress, setIsDeletingAddress] = useState(false);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="flex flex-col w-full border p-4 rounded">
      {selectedAddress === address.id && (
        <Badge variant="default" className="w-max mb-2">
          Selected
        </Badge>
      )}
      <div className="flex flex-col">
        <p>{address.line1}</p>
        <p>{address.line2}</p>
        <p>{address.country}</p>
        <p>{address.postal_code}</p>
        <p>{address.state}</p>
      </div>
      <div className="inline-flex justify-end gap-2">
        <Button
          disabled={isAddingNewAddress}
          aria-disabled={isAddingNewAddress ? "true" : "false"}
          className="inline-flex gap-2"
          onClick={() =>
            void startTransition(async () => {
              try {
                setIsAddingNewAddress(true);
                await selectAddressAction(address.id);
                toast.success("Address has been selected.");
              } catch (err) {
                catchError(err);
              } finally {
                setIsAddingNewAddress(false);
              }
            })
          }
        >
          {isAddingNewAddress && <IconLoading />}
          Select Address
        </Button>
        <Button
          disabled={isDeletingAddress}
          aria-disabled={isDeletingAddress ? "true" : "false"}
          onClick={() =>
            void startTransition(async () => {
              setIsDeletingAddress(true);
              try {
                await deleteExistingAddressAction(address.id);
                toast.success("Address has been deleted.");
              } catch (error) {
                catchError(error);
              } finally {
                setIsDeletingAddress(false);
              }
            })
          }
          variant="outline"
          size="icon"
        >
          {isDeletingAddress ? <IconLoading /> : <IconTrashCan />}
        </Button>
      </div>
    </div>
  );
}
