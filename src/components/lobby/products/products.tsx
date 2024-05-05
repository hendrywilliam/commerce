"use client";

import {
  sortingProductsItem,
  productCategories,
  rowsPerPage,
} from "@/config/products";
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
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useTransition } from "react";
import ReactSlider from "react-slider";
import { useState, useEffect } from "react";
import { Product, Store } from "@/db/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/pagination";
import { IconSort } from "@/components/ui/icons";
import { Checkbox } from "@/components/ui/checkbox";
import { buttonVariants } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { useQueryString } from "@/hooks/use-query-string";
import ProductCard from "@/components/lobby/product-card";
import { IconFilter, IconTrashCan } from "@/components/ui/icons";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NoResultMessage from "@/components/no-result-message";

interface ProductsProps {
  allStoresAndProducts: {
    products: Product;
    stores: Store | null;
  }[];
  productsPageCount: number;
  currentPage: number;
  sellers?: string;
  categories?: string;
}

export default function Products({
  allStoresAndProducts,
  productsPageCount,
  currentPage,
  sellers,
  categories,
}: ProductsProps) {
  const [isNewValue, setIsNewValue] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [maxPrice, setMaxPrice] = useState(99999);
  const [sellersSlug, setSellersSlug] = useState<string[]>(
    sellers?.split(".") ?? [],
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categories?.split(".") ?? [],
  );
  const router = useRouter();
  const pathname = usePathname();
  const { createQueryString, deleteQueryString } = useQueryString();

  const allProducts = allStoresAndProducts.map((storeAndProduct) => {
    return storeAndProduct.products;
  });

  const allStores = allStoresAndProducts
    .map((storeAndProduct) => storeAndProduct.stores)
    .filter((store) => Boolean(store)) as Store[];

  const uniqueStores =
    allStores.length > 0
      ? [...new Map(allStores.map((store) => [store.name, store])).values()]
      : [];

  useEffect(() => {
    const bounceUpdate = setTimeout(() => {
      if (selectedCategories.length > 0 && isNewValue) {
        const joinedCategories = selectedCategories.join(".");
        startTransition(() => {
          void router.push(
            `${pathname}?${createQueryString("category", joinedCategories)}`,
          );
        });
      }

      if (selectedCategories.length === 0 && isNewValue) {
        startTransition(() => {
          void router.push(`${pathname}?${deleteQueryString("category")}`);
        });
      }
    }, 500);

    return () => clearTimeout(bounceUpdate);
    // eslint-disable-next-line
  }, [selectedCategories]);

  useEffect(() => {
    const bounceUpdate = setTimeout(() => {
      if (sellersSlug.length > 0 && isNewValue) {
        const joinedSellers = sellersSlug.join(".");
        startTransition(() => {
          void router.push(
            `${pathname}?${createQueryString("sellers", joinedSellers)}`,
          );
        });
      }

      if (sellersSlug.length === 0 && isNewValue) {
        startTransition(() => {
          void router.push(`${pathname}?${deleteQueryString("sellers")}`);
        });
      }
    }, 500);

    return () => clearTimeout(bounceUpdate);
    // eslint-disable-next-line
  }, [sellersSlug]);

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
                deleteQueryString("page");
                router.push(
                  `${pathname}?${createQueryString("page_size", value)}`,
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
              <div className="h-full w-full">
                <h1 className="text-2xl font-semibold">Filter</h1>
                <div className="my-2 flex h-full w-full flex-col gap-4 overflow-y-auto rounded">
                  <div className="my-4">
                    <h1 className="mb-2 text-base font-semibold">
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
                    <div className="mt-2 inline-flex w-full justify-between ">
                      <p>${minPrice}</p>
                      <p>${maxPrice}</p>
                    </div>
                    <div className="mt-2 inline-flex gap-2">
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
                    <h1 className="text-base font-semibold">Stores</h1>
                    <ul className="flex flex-col gap-2">
                      {uniqueStores.length > 0 &&
                        uniqueStores.map((store) => (
                          <li className="inline-flex gap-2" key={store.id}>
                            <Checkbox
                              checked={sellersSlug.includes(store.slug)}
                              disabled={isPending}
                              aria-disabled={isPending ? "true" : "false"}
                              onCheckedChange={(checked) => {
                                setIsNewValue((isNewValue) => true);
                                return checked
                                  ? setSellersSlug((sellersSlug) => [
                                      ...sellersSlug,
                                      store.slug,
                                    ])
                                  : setSellersSlug((sellersSlug) =>
                                      sellersSlug.filter((slug) => {
                                        return slug !== store.slug;
                                      }),
                                    );
                              }}
                            />
                            <p>{store?.name}</p>
                          </li>
                        ))}
                    </ul>
                  </div>
                  <div className="flex flex-col gap-2 overflow-y-auto">
                    <h1 className="text-base font-semibold">Categories</h1>
                    <ul className="flex flex-col gap-2">
                      {productCategories.map((category, i) => (
                        <div className="inline-flex gap-2" key={i}>
                          <Checkbox
                            disabled={isPending}
                            aria-disabled={isPending ? "true" : "false"}
                            checked={selectedCategories.includes(
                              category.value,
                            )}
                            onCheckedChange={(checked) => {
                              setIsNewValue((isNewValue) => true);
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
                  className="flex w-full gap-1"
                  variant={"outline"}
                  disabled={isPending}
                  aria-disabled={isPending ? "true" : "false"}
                  onClick={() =>
                    startTransition(() => {
                      // Set to default.
                      setMinPrice(0);
                      setMaxPrice(99999);
                      setSelectedCategories([]);
                      setSellersSlug([]);
                      router.push("/products");
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
            <DropdownMenuLabel>Sort Products</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {sortingProductsItem.map((sortingItem, i) => (
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
                className="justify-between text-xs"
              >
                {sortingItem.title}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {!!allProducts.length ? (
        <>
          <div className="grid h-full min-h-[720px] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            {allProducts.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
          <div className="mt-4 flex w-full justify-center">
            <Pagination
              totalPage={productsPageCount}
              currentPage={currentPage}
            />
          </div>
        </>
      ) : (
        <NoResultMessage message="No data shown. Try to change filter or reload this page." />
      )}
    </div>
  );
}
