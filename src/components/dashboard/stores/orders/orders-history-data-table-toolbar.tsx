"use client";

import { Input } from "@/components/ui/input";
import { usePathname, useRouter } from "next/navigation";
import { useQueryString } from "@/hooks/use-query-string";
import { useEffect, useState, useTransition } from "react";

export default function OrdersHistoryDataTableToolbar() {
  const { push } = useRouter();
  const pathname = usePathname();
  const [filter, setFilter] = useState("");
  const { createQueryString } = useQueryString();
  const [isPending, startTransition] = useTransition();
  const [hasInteraction, setHasInteraction] = useState(false);

  useEffect(() => {
    const debounce = setTimeout(() => {
      startTransition(() => {
        if (hasInteraction) {
          void push(`${pathname}?${createQueryString("name", filter)}`);
        }
      });
    }, 1000);

    return () => clearTimeout(debounce);
    // eslint-disable-next-line
  }, [filter]);

  return (
    <div className="w-full my-4">
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
