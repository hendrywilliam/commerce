"use client";

import { useTransition, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { useQueryString } from "@/hooks/use-query-string";
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
  const { createQueryString } = useQueryString();

  const router = useRouter();
  const pathname = usePathname();

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

  const paginationButtons = useMemo(() => {
    if (totalPage === 1) {
      return [1];
    }

    const center = [
        currentPage - 2,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        currentPage + 2,
      ],
      filteredCenter = center.filter(
        (page) => page > 1 && page < totalPage,
      ) as [number | string],
      includeThreeLeft = currentPage === 5,
      includeThreeRight = currentPage === totalPage - 4,
      includeLeftDots = currentPage > 5,
      includeRightDots = currentPage < totalPage - 4;

    if (includeThreeLeft) filteredCenter.unshift(2);
    if (includeThreeRight) filteredCenter.push(totalPage - 1);
    if (includeLeftDots) filteredCenter.unshift("...");
    if (includeRightDots) filteredCenter.push("...");

    return [1, ...filteredCenter, totalPage];
  }, [totalPage, currentPage]);

  return (
    <div className="inline-flex w-max justify-center gap-2">
      <Button
        onClick={moveBackwardOnePage}
        disabled={currentPage === 1 || isPending}
        size={"icon"}
        variant={"outline"}
      >
        <IconArrowBackward />
      </Button>
      {paginationButtons.map((page) => {
        return isNaN(Number(page)) ? (
          <Button>{page}</Button>
        ) : (
          <Button
            onClick={() =>
              void startTransition(() => {
                router.push(
                  `${pathname}?${createQueryString("page", String(page))}`,
                );
              })
            }
            size="icon"
            variant={currentPage === page ? "default" : "outline"}
            key={page}
            disabled={isPending}
          >
            {page}
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
