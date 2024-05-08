/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Input } from "@/components/ui/input";
import { usePathname, useRouter } from "next/navigation";
import { useQueryString } from "@/hooks/use-query-string";
import { useEffect, useState, useTransition } from "react";

export default function OrdersHistoryActionPanel() {
  const { push } = useRouter();
  const pathname = usePathname();
  const [filter, setFilter] = useState("");
  const [isPending, startTransition] = useTransition();
  const [hasInteraction, setHasInteraction] = useState(false);
  const { createQueryString, deleteQueryString } = useQueryString();

  useEffect(() => {
    const debounce = setTimeout(() => {
      startTransition(() => {
        if (hasInteraction && !!filter.length) {
          void push(`${pathname}?${createQueryString("name", filter)}`);
        } else {
          void push(`${pathname}?${deleteQueryString("name")}`);
        }
      });
    }, 1000);

    return () => clearTimeout(debounce);
  }, [filter]);

  return (
    <div className="my-4 w-full">
      <Input
        onChange={(event) => {
          setFilter(event.target.value);
          setHasInteraction(true);
        }}
        placeholder="Filter orders..."
        className="w-44"
      />
    </div>
  );
}
