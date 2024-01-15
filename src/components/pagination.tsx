"use client";

import { Button } from "@/components/ui/button";
import { useTransition, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { IconArrowBackward, IconArrowForward } from "@/components/ui/icons";

interface PaginationProps {
  totalPage: number;
  currentPage: number;
}

export default function Pagination({
  totalPage,
  currentPage,
}: PaginationProps) {
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
    [searchParams],
  );

  function moveForwardOnePage() {
    if (currentPage < totalPage) {
      void startTransition(() => {
        router.push(
          `${pathname}?${createQueryString("page", String(currentPage + 1))}`,
        );
      });
    }
  }

  function moveBackwardOnePage() {
    if (currentPage > 1) {
      void startTransition(() => {
        router.push(
          `${pathname}?${createQueryString("page", String(currentPage - 1))}`,
        );
      });
    }
  }

  return (
    <div className="inline-flex w-full justify-center gap-2">
      <Button
        onClick={moveBackwardOnePage}
        disabled={currentPage === 1 || isPending}
        size={"icon"}
        variant={"outline"}
      >
        <IconArrowBackward />
      </Button>
      {Array.from({ length: totalPage }).map((_, i) => {
        return (
          <Button
            onClick={() =>
              void startTransition(() => {
                router.push(
                  `${pathname}?${createQueryString("page", String(i + 1))}`,
                );
              })
            }
            size={"icon"}
            variant={"outline"}
            key={i}
            disabled={isPending}
          >
            {i + 1}
          </Button>
        );
      })}
      <Button
        onClick={moveForwardOnePage}
        disabled={totalPage === currentPage || isPending}
        size={"icon"}
        variant={"outline"}
      >
        <IconArrowForward />
      </Button>
    </div>
  );
}
