"use client";

import { useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LogoutIcon } from "@/components/ui/icons";
import { catchError } from "@/lib/utils";
import { toast } from "sonner";

export default function DashboardNavigationUserPanel() {
  const { signOut } = useClerk();

  return (
    <div className="w-full">
      <div className="inline-flex w-full gap-2">
        <AlertDialog>
          <AlertDialogTrigger>
            <Button variant="outline" className="flex gap-2">
              Logout
              <LogoutIcon />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to log out of your account? Logging out
                will end your current session and you will need to log in again
                to access your account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  onClick={async () => {
                    try {
                      await signOut();
                      toast.success(
                        "You have been successfully logged out of your account.",
                      );
                    } catch (error) {
                      catchError(error);
                    }
                  }}
                  variant="secondary"
                  className="inline-flex gap-1"
                >
                  Confirm
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
