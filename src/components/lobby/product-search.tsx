"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconMagnifyingGlass } from "@/components/ui/icons";
import { getProductsBySearchTermAction } from "@/actions/products/product-search";
import { Product } from "@/db/schema";
import { useRouter } from "next/navigation";
import { IconBackpack, IconShoes, IconClothing } from "@/components/ui/icons";

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
    Record<string, Pick<Product, "name" | "id" | "category">[]>
  >({});
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
        (
          await getProductsBySearchTermAction(searchTerm)
            .then((res) => {
              if (!res.length) setHasNoResult(true);
              return res as Pick<Product, "id" | "name" | "category">[];
            })
            .finally(() => {
              setIsLoading(false);
            })
        ).reduce(
          (group, product) => {
            const { category } = product;
            group[category] = group[category] ?? [];
            group[category].push(product);
            return group;
          },
          {} as Record<string, Pick<Product, "name" | "id" | "category">[]>
        )
      );
    }, 500);
    return () => clearTimeout(getProductsData);
  }, [searchTerm]);

  return (
    <>
      <div>
        <Button
          variant={"outline"}
          className="inline-flex w-64 h-full gap-2"
          onClick={() => void setIsOpen((val) => !val)}
        >
          Search any products..
          <kbd className="w-max text-xs border rounded px-1 bg-muted-foreground/10">
            Ctrl + K
          </kbd>
        </Button>
      </div>
      <Dialog open={isOpen} onOpenChange={(isOpen) => setIsOpen(isOpen)}>
        <DialogContent className="p-1 gap-1">
          <div className="inline-flex py-1 px-2">
            <IconMagnifyingGlass className="flex self-center" />
            <Input
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0 outline-none focus-visible:ring-0 shadow-none"
              placeholder="Type a command or search... "
            />
          </div>
          {!hasNoResult ? (
            Object.entries(results).map(([category, products], i) => {
              return (
                <div key={i}>
                  <div className="text-xs px-1 text-gray-400">
                    <h2>{category}</h2>
                  </div>
                  <div className="px-1 py-2">
                    {products.map((item) => {
                      return (
                        <Button
                          variant={"ghost"}
                          className="w-full h-8 justify-start px-1 gap-2"
                          onClick={() =>
                            void router.push(
                              `/products/${item.category}/${item.id}`
                            )
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
            <div className="flex p-2 w-full justify-center">
              <p>No results found.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
