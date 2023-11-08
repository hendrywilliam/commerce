"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Product } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { IconSort } from "@/components/ui/icons";
import { useCallback, useTransition } from "react";
import { buttonVariants } from "@/components/ui/button";
import { IconFilter, IconTrashCan } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import ReactSlider from "react-slider";
import ProductCard from "@/components/lobby/product-card";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { siteConfig } from "@/config/site-config";

interface ProductsProps {
  products: Product[];
}

export default function Products({ products }: ProductsProps) {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(9999);
  const [isPending, startTransition] = useTransition();

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

  function createFilterQueryString(filterValue: [string, string][]) {
    const params = new URLSearchParams(searchParams);
    for (const [key, value] of filterValue) {
      if (!params.has(key)) {
        params.set(key, value);
      } else {
        params.delete(key);
        params.set(key, value);
      }
    }
    startTransition(() => {
      void router.push(`${pathname}?${params.toString()}`);
    });
  }
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
                  <h1>Price Range ($)</h1>
                  <div className="my-2">
                    <ReactSlider
                      className="relative w-full"
                      thumbClassName="absolute -top-1.5 rounded-full w-3 h-3 border border-black bg-white"
                      trackClassName="h-2 border-t-2"
                      defaultValue={[minPrice, maxPrice]}
                      ariaLabel={["Lower Thumb", "Upper Thumb"]}
                      ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
                      pearling
                      onChange={(value, index) => {
                        if (index === 1) {
                          setMaxPrice(value[1]);
                        } else {
                          setMinPrice(value[0]);
                        }
                      }}
                      max={9999}
                      minDistance={1000}
                    />
                    <div className="w-full inline-flex mt-2 justify-between ">
                      <p>${minPrice}</p>
                      <p>${maxPrice}</p>
                    </div>
                    <div className="inline-flex gap-2 mt-2">
                      <Input
                        value={minPrice}
                        min={0}
                        onChange={(e) =>
                          void setMinPrice(Number(e.target.value))
                        }
                      />
                      <Input
                        value={maxPrice}
                        onChange={(e) =>
                          void setMaxPrice(Number(e.target.value))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() =>
                    createFilterQueryString([
                      ["pmin", String(minPrice)],
                      ["pmax", String(maxPrice)],
                    ])
                  }
                  className="w-full"
                >
                  Apply Filter
                </Button>
                <Button
                  className="flex gap-1"
                  variant={"outline"}
                  onClick={() =>
                    startTransition(() => {
                      void router.push("/products");
                    })
                  }
                >
                  Clear filter
                  <IconTrashCan />
                </Button>
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
            {siteConfig.sortingProductsItem.map((sortingItem, i) => (
              <DropdownMenuItem
                key={i}
                onClick={() =>
                  void router.push(
                    `${pathname}?${createQueryString(
                      "sort",
                      `${sortingItem.sortKey}.${
                        sortingItem.reverse ? "desc" : "asc"
                      }`
                    )}`
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
      <div className="grid grid-cols-4 gap-2">
        {products.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
}
