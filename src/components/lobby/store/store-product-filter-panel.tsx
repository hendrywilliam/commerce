"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useTransition } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { rowsPerPage } from "@/config/products";
import { IconSort } from "@/components/ui/icons";
import { buttonVariants } from "@/components/ui/button";
import { sortingProductsItem } from "@/config/products";
import { useQueryString } from "@/hooks/use-query-string";

export default function StoreProductFilterPanel() {
  const [isPending, startTransition] = useTransition();
  const { createQueryString, deleteQueryString } = useQueryString();

  const { push } = useRouter();
  const pathname = usePathname();

  return (
    <div className="inline-flex gap-2">
      <Select
        onValueChange={(value) =>
          startTransition(() => {
            deleteQueryString("page");
            void push(`${pathname}?${createQueryString("page_size", value)}`);
          })
        }
      >
        <SelectTrigger disabled={isPending} className="w-16">
          <SelectValue placeholder="10" />
        </SelectTrigger>
        <SelectContent>
          {rowsPerPage.map((row, i) => (
            <SelectItem key={i} value={row.value}>
              {row.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={buttonVariants({
            variant: "outline",
            class: "flex gap-2",
          })}
        >
          Sort <IconSort />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40">
          <DropdownMenuLabel>Sort Products</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {sortingProductsItem.map((sortingItem, i) => (
            <DropdownMenuItem
              key={i}
              onClick={() =>
                void push(
                  `${pathname}?${createQueryString(
                    "sort",
                    `${sortingItem.sortKey}.${
                      sortingItem.reverse ? "desc" : "asc"
                    }`,
                  )}`,
                )
              }
              className="text-xs justify-between"
            >
              {sortingItem.title}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
