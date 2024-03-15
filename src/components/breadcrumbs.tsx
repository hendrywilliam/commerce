"use client";

import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import { ArrowRightIcon } from "@/components/ui/icons";

export default function Breadcrumbs() {
  const segments = useSelectedLayoutSegments();

  return (
    <div className="container flex items-center gap-4 py-4 text-sm text-gray-500">
      {segments.map((segment, index) => (
        <>
          <Link
            href={`/${segments.slice(0, index + 1).join("/")}`}
            key={index}
            className="capitalize  hover:text-gray-600"
          >
            {segment}
          </Link>
          {index !== segments.length - 1 && (
            <ArrowRightIcon className="pointer-events-none h-2 w-2" />
          )}
        </>
      ))}
    </div>
  );
}
