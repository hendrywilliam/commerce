"use client";

import { useTransition } from "react";
import type { BillingPlan } from "@/types";
import { Button } from "@/components/ui/button";
import { IconLoading } from "@/components/ui/icons";
import { catchError, formatCurrency } from "@/lib/utils";
import { manageSubscriptionAction } from "@/actions/stripe/manage-subscription";

interface DashboardBillingPlanCard extends BillingPlan {
  stripeCustomerId: string;
}

export default function DashboardBillingPlanCard({
  plan,
}: DashboardBillingPlanCard) {
  const [isPending, startTransition] = useTransition();

  // Plan id is equal to Price Id (Product identifier in Stripe)
  function handleSubscribeToPlan(planId: string) {
    startTransition(async () => {
      try {
        const session = await manageSubscriptionAction({
          subscriptionPriceId: plan.id,
        });

        if (session) {
          window.location.href = session.url ?? "/dashboard/billing";
        }
      } catch (error) {
        catchError(error);
      }
    });
  }

  return (
    <div
      className="flex flex-col border rounded p-4 h-64 justify-between shadow-sm"
      key={plan.id}
    >
      <div>
        <h1 className="text-xl font-bold">{plan.title}</h1>
        <p className="text-xl mt-2 font-bold">
          {formatCurrency(plan.price)}{" "}
          <span className="text-sm font-normal">per month</span>
        </p>
        <p className="text-gray-500">{plan.description}</p>
      </div>
      <div>
        <Button
          onClick={() => void handleSubscribeToPlan(plan.id)}
          disabled={isPending}
          aria-disabled={isPending ? "true" : "false"}
          className="flex gap-2 w-full"
        >
          {plan.title === "Hobby" ? "Get started" : "Change Plan"}
          {isPending && <IconLoading />}
        </Button>
      </div>
    </div>
  );
}
