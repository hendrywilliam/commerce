"use client";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUser, useClerk } from "@clerk/nextjs";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export default function AccountNavigation() {
  const router = useRouter();
  const { signOut } = useClerk();
  const { user, isSignedIn } = useUser();

  return (
    <div className="flex self-center">
      {!isSignedIn ? (
        <Button
          data-testid="signin-button"
          onClick={() => void router.push("/sign-in")}
        >
          Sign in
        </Button>
      ) : (
        <DropdownMenu data-testid="account-menu">
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
              <Link className="w-full h-full" href="/dashboard">
                Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Setting</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => void signOut()}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
