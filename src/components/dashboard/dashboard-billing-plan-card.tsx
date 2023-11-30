"use client";

import { useTransition } from "react";
import type { BillingPlan } from "@/types";
import { catchError, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IconLoading } from "@/components/ui/icons";
import { createCustomerSubscriptionAction } from "@/actions/users/create-subscription";

export default function DashboardBillingPlanCard({ plan }: BillingPlan) {
  const [isPending, startTransition] = useTransition();

  // Plan id is equal to Price Id (Product identifier in Stripe)
  function handleSubscribeToPlan(planId: string) {
    startTransition(async () => {
      try {
        await createCustomerSubscriptionAction(planId);
      } catch (error) {
        catchError(error);
      }
    });
  }

  return (
    <div
      className="flex flex-col border rounded p-2 h-64 justify-between"
      key={plan.id}
    >
      <div>
        <h1 className="text-xl font-bold">{plan.title}</h1>
        <p className="text-xl mt-2 font-bold">{formatCurrency(plan.price)}</p>
        <p className="text-gray-500">{plan.description}</p>
      </div>
      <div>
        <Button
          onClick={() => void handleSubscribeToPlan(plan.id)}
          className="w-full"
        >
          Change plan
          {isPending && <IconLoading />}
        </Button>
      </div>
    </div>
  );
}
