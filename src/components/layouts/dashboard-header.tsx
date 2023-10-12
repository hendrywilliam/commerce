"use client";
import { useUser } from "@clerk/nextjs";
import { IconPointAside } from "@/components/ui/icons";
import Link from "next/link";

export default function DashboardHeader() {
  const { user } = useUser();

  return (
    <div className="flex border-b w-full h-16 items-center">
      <div className="container">
        <p className="flex font-semibold items-center gap-1">
          <Link href="/">
            <IconPointAside />
          </Link>
          {user && user.emailAddresses[0].emailAddress}
        </p>
      </div>
    </div>
  );
}
