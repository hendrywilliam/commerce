"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Address } from "@/db/schema";
import { ShipmentIcon } from "@/components/ui/icons";
import { buttonVariants } from "@/components/ui/button";
import AddressCard from "@/components/lobby/checkout/address-card";
import AddNewAddressForm from "@/components/lobby/checkout/add-new-address-form";

interface UserAddressActionProps {
  addresses: Address[];
  selectedAddress?: Pick<Address, "id">["id"];
}

export default function UserAddressAction({
  addresses,
  selectedAddress,
}: UserAddressActionProps) {
  return (
    <div className="flex w-full justify-end gap-2">
      <Dialog>
        <DialogTrigger className={buttonVariants({ variant: "outline" })}>
          Select Address
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <h1 className="font-semibold text-2xl">Select Address</h1>
          </DialogHeader>
          {addresses.length &&
            addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                selectedAddress={selectedAddress}
              />
            ))}
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger
          className={buttonVariants({
            variant: "outline",
            class: "flex gap-2",
          })}
        >
          <ShipmentIcon />
          Add New Address
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <h1 className="font-semibold text-2xl">Add Address</h1>
            <p>This will be your shipment address.</p>
          </DialogHeader>
          <AddNewAddressForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}
