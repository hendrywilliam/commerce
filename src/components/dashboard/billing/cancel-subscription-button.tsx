"use client";

import { toast } from "sonner";
import { useState } from "react";
import { catchError } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IconLoading } from "@/components/ui/icons";
import { cancelCurrentSubscriptionAction } from "@/actions/stripe/cancel-subscription";

export default function CancelSubscriptionButton() {
  const [isLoading, setIsLoading] = useState(false);

  async function cancelSubscriptionHandler() {
    setIsLoading((isLoading) => !isLoading);
    try {
      await cancelCurrentSubscriptionAction();
      toast.success("Subscription canceled.");
    } catch (error) {
      catchError(error);
    } finally {
      setIsLoading((isLoading) => !isLoading);
    }
  }

  return (
    <Button
      onClick={cancelSubscriptionHandler}
      className="gap-2"
      disabled={isLoading}
      aria-disabled={isLoading ? "true" : "false"}
    >
      {isLoading && <IconLoading />}
      Cancel Subscription
    </Button>
  );
}
