"use client";

import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { LogoutIcon } from "@/components/ui/icons";

export default function DashboardNavigationUserPanel() {
  const { user } = useUser();

  return (
    <div className="w-full">
      <div className="inline-flex w-full gap-2">
        <Button variant="secondary" className="inline-flex gap-1">
          Logout <LogoutIcon />
        </Button>
      </div>
    </div>
  );
}
