"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUser } from "@clerk/nextjs";
import { UserObjectCustomized } from "@/types";
import { Button } from "@/components/ui/button";
import { LogoutIcon } from "@/components/ui/icons";
import { getPrimaryEmail, truncate } from "@/lib/utils";

export default function DashboardNavigationUserPanel() {
  const { user } = useUser();

  return (
    <div className="w-full">
      <p className="text-sm text-gray-400">Logged in as</p>
      <div className="inline-flex w-full gap-2">
        <Select>
          <SelectTrigger className="w-full mt-1">
            <SelectValue
              placeholder={truncate(
                getPrimaryEmail(user as unknown as UserObjectCustomized),
                15,
              )}
            />
          </SelectTrigger>
          <SelectContent>
            {user &&
              user.emailAddresses.map((emailAddress, index) => (
                <SelectItem key={index} value="light">
                  {emailAddress.toString()}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="outline" size="icon">
                <LogoutIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
