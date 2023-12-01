"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import Pagination from "@/components/pagination";
import { IconSort } from "@/components/ui/icons";
import { siteConfig } from "@/config/site-config";
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
  productsPageCount: number;
  currentPage: number;
}

export default function Products({
  allStoresAndProducts,
  filterStoreItems,
  productsPageCount,
  currentPage,
}: ProductsProps) {
  const [isNewValue, setIsNewValue] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [maxPrice, setMaxPrice] = useState(99999);
  const [sellersId, setSellersId] = useState<number[]>([]);
  const [selectedCategories, setSelectedCategories] = useState([] as string[]);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlSearchParams = new URLSearchParams(searchParams);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      urlSearchParams.set(name, value);

      return urlSearchParams.toString();
    },
    // eslint-disable-next-line
    [searchParams],
  );

  const allProducts = allStoresAndProducts.map((storeAndProduct) => {
    return storeAndProduct.products;
  });

  const uniqueStores = [
    ...new Map(filterStoreItems.map((store) => [store?.name, store])).values(),
  ];

  useEffect(() => {
    const bounceUpdate = setTimeout(() => {
      if (selectedCategories.length) {
        const joinedCategories = selectedCategories.join(".");
        startTransition(() => {
          void router.push(
            `${pathname}?${createQueryString("category", joinedCategories)}`,
          );
        });
      } else {
        urlSearchParams.delete("category");
        startTransition(() => {
          void router.push(`${pathname}?${urlSearchParams}`);
        });
      }
    }, 500);

    return () => clearTimeout(bounceUpdate);
    // eslint-disable-next-line
  }, [selectedCategories]);

  useEffect(() => {
    const bounceUpdate = setTimeout(() => {
      if (sellersId.length) {
        const joinedCategories = sellersId.join(".");
        startTransition(() => {
          void router.push(
            `${pathname}?${createQueryString("sellers", joinedCategories)}`,
          );
        });
      } else {
        urlSearchParams.delete("sellers");
        startTransition(() => {
          void router.push(`${pathname}?${urlSearchParams}`);
        });
      }
    }, 500);

    return () => clearTimeout(bounceUpdate);
    // eslint-disable-next-line
  }, [sellersId]);

  useEffect(() => {
    const bounce = setTimeout(() => {
      if (isNewValue) {
        createQueryString("pmin", String(minPrice));
        startTransition(() => {
          void router.push(
            `${pathname}?${createQueryString("pmax", String(maxPrice))}`,
          );
        });
      }
    }, 500);

    return () => clearTimeout(bounce);

    // eslint-disable-next-line
  }, [minPrice, maxPrice]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full justify-end gap-2">
        <div className="inline-flex items-center gap-2">
          <p>Row per page:</p>
          <Select
            onValueChange={(value) =>
              startTransition(() => {
                void router.push(
                  `${pathname}?${createQueryString("page_size", value)}`,
                );
              })
            }
          >
            <SelectTrigger disabled={isPending} className="w-16">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              {siteConfig.rowsPerPage.map((row, i) => (
                <SelectItem key={i} value={row.value}>
                  {row.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
                          setIsNewValue(true);
                        } else {
                          setMinPrice(value[0]);
                          setIsNewValue(true);
                        }
                      }}
                      max={99999}
                      minDistance={1000}
                    />
                    <div className="w-full inline-flex mt-2 justify-between ">
                      <p>${minPrice}</p>
                      <p>${maxPrice}</p>
                    </div>
                    <div className="inline-flex gap-2 mt-2">
                      <Input
                        value={minPrice}
                        disabled={isPending}
                        aria-disabled={isPending ? "true" : "false"}
                        min={0}
                        onChange={(e) => {
                          void setMinPrice(Number(e.target.value));
                          setIsNewValue(true);
                        }}
                      />
                      <Input
                        value={maxPrice}
                        disabled={isPending}
                        aria-disabled={isPending ? "true" : "false"}
                        onChange={(e) => {
                          void setMinPrice(Number(e.target.value));
                          setIsNewValue(true);
                        }}
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
                            disabled={isPending}
                            aria-disabled={isPending ? "true" : "false"}
                            onCheckedChange={(checked) => {
                              return checked
                                ? setSellersId((sellersId) => [
                                    ...sellersId,
                                    store?.id as number,
                                  ])
                                : setSellersId((sellersId) =>
                                    sellersId.filter((id) => {
                                      return id !== store?.id;
                                    }),
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
                              category.value,
                            )}
                            onCheckedChange={(checked) => {
                              return checked
                                ? setSelectedCategories(
                                    (selectedCategories) => [
                                      ...selectedCategories,
                                      category.value,
                                    ],
                                  )
                                : setSelectedCategories((selectedCategories) =>
                                    selectedCategories.filter((cat) => {
                                      return cat !== category?.value;
                                    }),
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
              <div className="w-full">
                <Button
                  className="flex gap-1 w-full"
                  variant={"outline"}
                  disabled={isPending}
                  aria-disabled={isPending ? "true" : "false"}
                  onClick={() =>
                    startTransition(() => {
                      // Set to default.
                      setMinPrice(0);
                      setMaxPrice(99999);
                      setSelectedCategories([]);
                      setSellersId([]);
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
      {allProducts.length ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 min-h-[720px] h-full">
            {allProducts.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
          <Pagination totalPage={productsPageCount} currentPage={currentPage} />
        </>
      ) : (
        <div className="w-full">
          <p>No product found.</p>
        </div>
      )}
    </div>
  );
}
