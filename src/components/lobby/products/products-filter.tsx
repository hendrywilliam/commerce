"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buttonVariants } from "@/components/ui/button";
import { IconFilter } from "@/components/ui/icons";
import {
  IconAlphabeticalAscending,
  IconAlphabeticalDescending,
} from "@/components/ui/icons";
import { useRouter } from "next/navigation";

export default function ProductsFilter() {
  const router = useRouter();

  function generateSearchQueryParams(name: string, value: string) {
    const params = new URLSearchParams();
    params.set(name, value);
    return String(params);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={buttonVariants({ class: "flex gap-2" })}>
        Sort <IconFilter />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuItem
          onClick={() =>
            void router.push(`?${generateSearchQueryParams("price", "low")}`)
          }
          className="justify-between"
        >
          Price: Low to High
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            void router.push(`?${generateSearchQueryParams("price", "high")}`)
          }
          className="justify-between"
        >
          Price: High to Low
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            void router.push(
              `?${generateSearchQueryParams("sort", "name.asc")}`
            )
          }
          className="justify-between"
        >
          Alphabet: A - Z <IconAlphabeticalAscending />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            void router.push(
              `?${generateSearchQueryParams("sort", "name.desc")}`
            )
          }
          className="justify-between"
        >
          Alphabet: Z - A. <IconAlphabeticalDescending />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
