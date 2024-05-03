"use client";

import { Store } from "@/db/schema";
import { User } from "@clerk/nextjs/server";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Props {
  firstname: User["firstName"];
  lastname: User["lastName"];
  stores: Store[];
}

export default function DashboardNavigation({
  firstname,
  lastname,
  stores,
}: Props) {
  const pathname = usePathname();
  const storeId = pathname.split("/")[2];
  const selectedStore =
    stores.find((store) => String(store.id) === storeId)?.name ?? "Stores";

  return (
    <div className="flex h-16 w-full border-b px-8">
      <div className="flex items-center space-x-4">
        <p>
          {firstname} {lastname}
        </p>
        <p>/</p>
        <p>{selectedStore}</p>
        {storeId && storeId.match(/[0-9]/) && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <CaretSortIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div>
                {stores.map((store) => (
                  <Link href={`/dashboard/${String(store.id)}`} key={store.id}>
                    {store.name}
                  </Link>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}
