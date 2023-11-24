"use client";

import { Address } from "@/db/schema";
import { useUser } from "@clerk/nextjs";
import type { UserObjectCustomized } from "@/types";
import UserAddressAction from "@/components/lobby/checkout/user-address-list-action";

interface UserAddressListProps {
  addresses: Address[];
}

export default function UserAddressList({ addresses }: UserAddressListProps) {
  const user = useUser()?.user as unknown as UserObjectCustomized;

  const selectedAddress = user?.publicMetadata.address;

  const isSelectedAddressExist =
    selectedAddress &&
    addresses.find((address) => selectedAddress === address.id);

  return (
    <div className="flex flex-col">
      <p className="font-semibold">Shipment Address</p>
      <div>
        {isSelectedAddressExist ? (
          <p>
            {isSelectedAddressExist.line1} {isSelectedAddressExist.line2}{" "}
            {isSelectedAddressExist.city} {isSelectedAddressExist.country}{" "}
            {isSelectedAddressExist.postal_code}
          </p>
        ) : (
          <p>You have not selected any address yet.</p>
        )}
      </div>
      <UserAddressAction
        addresses={addresses}
        selectedAddress={selectedAddress}
      />
    </div>
  );
}
