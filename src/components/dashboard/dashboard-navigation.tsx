"use client";

import { Store } from "@/db/schema";
import { User } from "@clerk/nextjs/server";
import Link from "next/link";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSelectedLayoutSegments } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { PlusIcon } from "@/components/ui/icons";

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
  const segments = useSelectedLayoutSegments();
  const selectedStore = stores.find((store) => store.slug === segments[2])
    ?.name;

  return (
    <div className="flex h-16 w-full border-b px-8">
      <div className="flex items-center space-x-4">
        <p className="font-semibold">
          {firstname} {lastname}
        </p>
        <p>/</p>
        <Link href="/dashboard">Dashboard</Link>
        {segments[1] === "stores" &&
          segments[2] !== "new-store" &&
          selectedStore && (
            <>
              <p>/</p>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="flex gap-2">
                    <span>{selectedStore}</span>
                    <CaretSortIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-1">
                  <div className="w-full space-y-1 px-1 py-2 text-sm">
                    {stores.map((store) => (
                      <Link
                        key={store.id}
                        href={`/dashboard/stores/${store.slug}`}
                        className={buttonVariants({
                          variant: "ghost",
                          size: "sm",
                          className: "flex w-full justify-between",
                        })}
                      >
                        <span className="w-full text-start">{store.name}</span>
                        {store.name === selectedStore && <CheckIcon />}
                      </Link>
                    ))}
                    <Link
                      href="/dashboard/stores/new-store"
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                        className: "w-full",
                      })}
                    >
                      <span className="w-full text-start">
                        Create New Store
                      </span>
                      <PlusIcon />
                    </Link>
                  </div>
                </PopoverContent>
              </Popover>
            </>
          )}
      </div>
    </div>
  );
}
