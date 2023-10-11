"use client";

import { Button } from "@/components/ui/button";
import { IconCart, IconNotification } from "@/components/ui/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export default function AccountNavigation() {
  const { user, isSignedIn } = useUser();

  return (
    <div className="flex w-1/3 justify-end gap-2">
      <Button className="rounded-full" variant={"outline"} size={"icon"}>
        <IconNotification />
      </Button>
      <Button className="rounded-full" variant={"outline"} size={"icon"}>
        <IconCart />
      </Button>
      {!isSignedIn && <Button variant={"outline"}>Sign in</Button>}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback></AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Link href="/dashboard">Dashboard</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>Setting</DropdownMenuItem>
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
