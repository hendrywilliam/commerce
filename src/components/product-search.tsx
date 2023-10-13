"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconMagnifyingGlass } from "@/components/ui/icons";
import { getProductsBySearchTerm } from "@/actions/products/product-search";
import { Product } from "@/db/schema";

export default function ProductSearch() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasNoResult, setHasNoResult] = useState(false);
  const [results, setResults] = useState<
    Pick<Product, "id" | "name" | "category">[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const keyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && e.ctrlKey) {
        e.preventDefault();
        setIsOpen((val) => !val);
      }
    };
    document.addEventListener("keydown", keyDown);

    return () => document.removeEventListener("keydown", keyDown);
  }, [isOpen]);

  useEffect(() => {
    if (searchTerm === "") return setResults([]);
    const getProductsData = setTimeout(async () => {
      if (searchTerm === "") return;
      setIsLoading(true);
      setHasNoResult(false);
      setResults(
        await getProductsBySearchTerm(searchTerm)
          .then((res) => {
            if (!res.length) setHasNoResult(true);
            return res as Pick<Product, "id" | "name" | "category">[];
          })
          .finally(() => {
            setIsLoading(false);
          })
      );
    }, 500);
    return () => clearTimeout(getProductsData);
  }, [searchTerm]);

  return (
    <>
      <div>
        <Button
          variant={"outline"}
          className="inline-flex w-64 h-full text-muted-foreground gap-2"
          onClick={() => setIsOpen((val) => !val)}
        >
          Search any products..
          <kbd className="w-max text-xs border rounded px-1">Ctrl + K</kbd>
        </Button>
      </div>
      <Dialog open={isOpen} onOpenChange={(isOpen) => setIsOpen(isOpen)}>
        <DialogContent className="p-0">
          <div className="inline-flex py-1 px-2">
            <IconMagnifyingGlass className="flex self-center" />
            <Input
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0 outline-none focus-visible:ring-0 shadow-none"
              placeholder="Type a command or search... "
            />
          </div>
          {results && (
            <div>
              {results.map((item) => {
                return <p key={item.id}>{item.name}</p>;
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
