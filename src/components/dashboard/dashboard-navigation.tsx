"use client";

import { Store } from "@/db/schema";
import { User } from "@clerk/nextjs/server";
import Link from "next/link";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSelectedLayoutSegments } from "next/navigation";
import { Button } from "@/components/ui/button";

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
        <p>
          {firstname} {lastname}
        </p>
        <p>/</p>
        <Link href="/dashboard">Dashboard</Link>
        {segments[1] === "stores" && segments[2] && selectedStore && (
          <>
            <p>/</p>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="flex gap-2">
                  <span>{selectedStore}</span>
                  <CaretSortIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-0">
                <div className="w-full p-2 text-sm">
                  {stores.map((store) => (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      key={store.id}
                    >
                      <Link
                        href={`/dashboard/stores/${String(store.slug)}`}
                        className="w-full"
                      >
                        {store.name}
                      </Link>
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </>
        )}
      </div>
    </div>
  );
}
