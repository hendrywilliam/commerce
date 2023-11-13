"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ReactSlider from "react-slider";
import { useState, useEffect } from "react";
import { Product, Store } from "@/db/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconSort } from "@/components/ui/icons";
import { siteConfig } from "@/config/site-config";
import { useDebounce } from "@/hooks/use-debounce";
import { useCallback, useTransition } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { buttonVariants } from "@/components/ui/button";
import ProductCard from "@/components/lobby/product-card";
import { IconFilter, IconTrashCan } from "@/components/ui/icons";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface ProductsProps {
  allStoresAndProducts: {
    products: Product;
    stores: Store | null;
  }[];
  filterStoreItems: Store[];
}

export default function Products({
  allStoresAndProducts,
  filterStoreItems,
}: ProductsProps) {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(9999);
  const [selectedCategories, setSelectedCategories] = useState([] as string[]);
  const [isPending, startTransition] = useTransition();
  const [sellersId, setSellersId] = useState<number[]>([]);

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

  const allProducts = allStoresAndProducts.map((storeAndProduct) => {
    return storeAndProduct.products;
  });

  const uniqueStores = [
    ...new Map(filterStoreItems.map((store) => [store?.name, store])).values(),
  ];

  useEffect(() => {
    const bounceUpdate = setTimeout(() => {
      if (selectedCategories.length > 0) {
        const joinedCategories = selectedCategories.join(".");
        startTransition(() => {
          void router.push(
            `${pathname}?${createQueryString("category", joinedCategories)}`
          );
        });
      } else {
        const params = new URLSearchParams(searchParams);
        params.delete("category");
        startTransition(() => {
          void router.push(`${pathname}?${params}`);
        });
      }
    }, 500);

    return () => clearTimeout(bounceUpdate);
    // eslint-disable-next-line
  }, [selectedCategories]);

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
              <div className="w-full h-full">
                <h1 className="font-semibold text-2xl">Filter</h1>
                <div className="flex flex-col gap-4 w-full h-full rounded my-2 overflow-y-auto">
                  <div className="my-4">
                    <h1 className="font-semibold text-base mb-2">
                      Price Range ($)
                    </h1>
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
                  <div className="flex flex-col gap-2 overflow-y-auto">
                    <h1 className="font-semibold text-base">Stores</h1>
                    <ul className="flex flex-col gap-2">
                      {uniqueStores.map((store, i) => (
                        <div className="inline-flex gap-2" key={i}>
                          <Checkbox
                            checked={sellersId.includes(store?.id as number)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? setSellersId((sellersId) => [
                                    ...sellersId,
                                    store?.id as number,
                                  ])
                                : setSellersId((sellersId) =>
                                    sellersId.filter((id) => {
                                      return id !== store?.id;
                                    })
                                  );
                            }}
                          />
                          <li>{store?.name}</li>
                        </div>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col gap-2 overflow-y-auto">
                    <h1 className="font-semibold text-base">Categories</h1>
                    <ul className="flex flex-col gap-2">
                      {siteConfig.productCategories.map((category) => (
                        <div className="inline-flex gap-2" key={category.id}>
                          <Checkbox
                            disabled={isPending}
                            aria-disabled={isPending ? "true" : "false"}
                            checked={selectedCategories.includes(
                              category.value
                            )}
                            onCheckedChange={(checked) => {
                              return checked
                                ? setSelectedCategories(
                                    (selectedCategories) => [
                                      ...selectedCategories,
                                      category.value,
                                    ]
                                  )
                                : setSelectedCategories((selectedCategories) =>
                                    selectedCategories.filter((cat) => {
                                      return cat !== category?.value;
                                    })
                                  );
                            }}
                          />
                          <li>{category.title}</li>
                        </div>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() =>
                    createFilterQueryString([
                      ["pmin", String(minPrice)],
                      ["pmax", String(maxPrice)],
                      [
                        "sellers",
                        sellersId.length ? sellersId.join(".") : "all",
                      ],
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
        {allProducts.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
}
