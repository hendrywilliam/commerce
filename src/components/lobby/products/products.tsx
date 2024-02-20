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

interface ProductsProps {
  allStoresAndProducts: {
    products: Product;
    stores: Store | null;
  }[];
  allStores: Store[];
  productsPageCount: number;
  currentPage: number;
  sellers?: string;
  categories?: string;
}

export default function Products({
  allStoresAndProducts,
  allStores,
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

  const uniqueStores = [
    ...new Map(allStores.map((store) => [store?.name, store])).values(),
  ];

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
                      {uniqueStores.map((store) => (
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
                    <h1 className="font-semibold text-base">Categories</h1>
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
                className="text-xs justify-between"
              >
                {sortingItem.title}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {!!allProducts.length ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 min-h-[720px] h-full">
            {allProducts.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
          <Pagination totalPage={productsPageCount} currentPage={currentPage} />
        </>
      ) : (
        <div className="flex items-center justify-center min-h-[450px] text-center">
          <h1 className="text-xl">
            Unfortunately, there is no product found. Try to change the filter
            or refresh the page.
          </h1>
        </div>
      )}
    </div>
  );
}
