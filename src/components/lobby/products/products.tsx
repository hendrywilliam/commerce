"use client";

import { Product } from "@/db/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buttonVariants } from "@/components/ui/button";
import { IconSort } from "@/components/ui/icons";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { IconFilter } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import ProductCard from "@/components/lobby/product-card";

interface ProductsProps {
  products: Product[];
}

export default function Products({ products }: ProductsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full justify-end gap-2">
        <Sheet>
          <SheetTrigger
            className={buttonVariants({
              variant: "outline",
              class: "flex gap-2 ",
            })}
          >
            Filter <IconFilter />
          </SheetTrigger>
          <SheetContent>
            <div className="flex h-full flex-col justify-between">
              <div>
                <h1 className="font-semibold text-2xl">Filter</h1>
                <div className="rounded w-full my-2">
                  <h1 className="font-bold">Price</h1>
                  <div className="flex gap-2 my-2">
                    <div>
                      <Label htmlFor="minimum-price">Min. Price</Label>
                      <Input id="minimum-price" />
                    </div>
                    <div>
                      <Label htmlFor="maximum-price">Max. Price</Label>
                      <Input id="maximum-price" />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <Button className="w-full">Apply Filter</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
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
            <DropdownMenuItem
              onClick={() =>
                void router.push(
                  `${pathname}?${createQueryString("sort", "createdAt.asc")}`
                )
              }
              className="text-xs justify-between"
            >
              Date: Newest to Oldest
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                void router.push(
                  `${pathname}?${createQueryString("sort", "createdAt.desc")}`
                )
              }
              className="text-xs justify-between"
            >
              Date: Oldest to Newest
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                void router.push(
                  `${pathname}?${createQueryString("sort", "price.asc")}`
                )
              }
              className="text-xs justify-between"
            >
              Price: Low to High
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                void router.push(`?${createQueryString("sort", "price.desc")}`)
              }
              className="text-xs justify-between"
            >
              Price: High to Low
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                void router.push(
                  `${pathname}?${createQueryString("sort", "name.asc")}`
                )
              }
              className="text-xs justify-between"
            >
              Alphabetical: A - Z
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                void router.push(
                  `${pathname}?${createQueryString("sort", "name.desc")}`
                )
              }
              className="text-xs justify-between"
            >
              Alphabetical: Z - A.
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {products.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
}
