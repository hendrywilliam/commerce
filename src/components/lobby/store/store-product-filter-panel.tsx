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
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { rowsPerPage } from "@/config/products";
import { IconSort } from "@/components/ui/icons";
import { search_params_builder } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { sortingProductsItem } from "@/config/products";

export default function StoreProductFilterPanel() {
  const [isPending, startTransition] = useTransition();

  const { push } = useRouter();
  const pathname = usePathname();

  return (
    <div className="inline-flex gap-2">
      <Select
        onValueChange={(value) =>
          startTransition(() => {
            void push(
              `${pathname}?${search_params_builder("page_size", value)}`,
            );
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
          {sortingProductsItem.map((sortingItem, i) => (
            <DropdownMenuItem
              key={i}
              onClick={() =>
                void push(
                  `${pathname}?${search_params_builder(
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
