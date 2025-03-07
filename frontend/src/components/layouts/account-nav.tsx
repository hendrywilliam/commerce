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
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";

export default function AccountNavigation() {
    const router = useRouter();
    const { user, isSignedIn } = useAuth();

    return (
        <div className="flex self-center">
            {!isSignedIn ? (
                <>
                    <p>{user?.fullname}</p>
                    <p>{isSignedIn}</p>
                    <Button
                        data-testid="signin-button"
                        onClick={() => void router.push("/sign-in")}
                    >
                        Sign in
                    </Button>
                </>
            ) : (
                <DropdownMenu data-testid="account-menu">
                    <DropdownMenuTrigger className="focus:outline-none">
                        <Avatar>
                            {user ? (
                                <AvatarImage src={user?.image_url} />
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
                        <DropdownMenuItem>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    );
}
