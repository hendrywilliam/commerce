"use client";

import { Product } from "@/db/schema";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "@/components/ui/icons";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { IconBackpack, IconShoes, IconClothing } from "@/components/ui/icons";
import { get_products_search_fetcher } from "@/fetchers/products/get-products-search";

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "backpack":
      return <IconBackpack />;
    case "clothing":
      return <IconClothing />;
    case "shoes":
      return <IconShoes />;
  }
};

export default function ProductSearch() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasNoResult, setHasNoResult] = useState(false);
  const [results, setResults] = useState<
    Record<Product["category"], Product[]> | {}
  >();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const keyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && e.ctrlKey) {
        e.preventDefault();
        setIsOpen((val) => !val);
      }
    };
    document.addEventListener("keydown", keyDown);

    return () => {
      document.removeEventListener("keydown", keyDown);
      setResults({});
      setHasNoResult(false);
    };
  }, [isOpen]);

  useEffect(() => {
    if (searchTerm === "") return setResults({});
    const getProductsData = setTimeout(async () => {
      if (searchTerm === "") return;
      setIsLoading(true);
      setHasNoResult(false);
      setResults(
        await get_products_search_fetcher(searchTerm)
          .then((res) => {
            if (!Object.entries(res).length) setHasNoResult(true);
            return res;
          })
          .finally(() => {
            setIsLoading(false);
          }),
      );
    }, 500);
    return () => clearTimeout(getProductsData);
  }, [searchTerm]);

  return (
    <>
      <Button
        variant={"outline"}
        className="inline-flex h-9 w-9 p-2 lg:w-max"
        onClick={() => void setIsOpen((val) => !val)}
      >
        <span className="hidden gap-2 lg:inline-flex">
          Search products..
          <kbd className="w-max rounded border bg-muted-foreground/10 px-1 text-xs">
            Ctrl + K
          </kbd>
        </span>
        <SearchIcon className="flex w-[1em] lg:hidden" />
      </Button>
      <Dialog open={isOpen} onOpenChange={(isOpen) => setIsOpen(isOpen)}>
        <DialogContent className="gap-1 p-1">
          <div className="inline-flex px-2 py-1">
            <SearchIcon className="flex self-center" />
            <Input
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0 shadow-none outline-none focus-visible:ring-0"
              placeholder="Type product name... "
            />
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {!hasNoResult && results ? (
              Object.entries(results).map(([category, products], i) => {
                return (
                  <div key={i}>
                    <div className="px-1 text-xs text-gray-400">
                      <h2>{category}</h2>
                    </div>
                    <div className="px-1 py-2">
                      {products.map((item) => {
                        return (
                          <Button
                            variant="ghost"
                            className="h-8 w-full justify-start gap-2 px-1"
                            onClick={() =>
                              void router.push(`/product/${item.slug}`)
                            }
                            key={item.id}
                          >
                            {getCategoryIcon(item.category)}
                            {item.name}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex w-full justify-center p-2">
                <p>No results found.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
