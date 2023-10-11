"use client";
import { useUser } from "@clerk/nextjs";

export default function DashboardHeader() {
  const { user } = useUser();

  return (
    <div className="flex border-b w-full h-16 items-center">
      <div className="container">
        <p className="font-semibold">
          {user && user.emailAddresses[0].emailAddress}
        </p>
      </div>
    </div>
  );
}
