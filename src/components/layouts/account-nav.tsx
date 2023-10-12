"use client";

import { Button } from "@/components/ui/button";
import { IconCart, IconNotification } from "@/components/ui/icons";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@clerk/nextjs";
import { useClerk } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AccountNavigation() {
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  return (
    <div className="flex w-1/3 justify-end gap-2">
      <Button className="rounded-full" variant={"outline"} size={"icon"}>
        <IconNotification />
      </Button>
      <Button className="rounded-full" variant={"outline"} size={"icon"}>
        <IconCart />
      </Button>
      {!isSignedIn ? (
        <Button
          variant={"outline"}
          onClick={() => void router.push("/sign-in")}
        >
          Sign in
        </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <Avatar>
              {user ? (
                <AvatarImage src={user?.imageUrl} />
              ) : (
                <AvatarImage src="https://avatars.githubusercontent.com/u/76040435?v=4" />
              )}
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link href="/dashboard">Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Setting</DropdownMenuItem>
            <DropdownMenuItem onClick={() => void signOut()}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
