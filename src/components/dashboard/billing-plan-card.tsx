"use client";

import { useTransition } from "react";
import type { BillingPlan } from "@/types";
import { Button } from "@/components/ui/button";
import { IconLoading } from "@/components/ui/icons";
import { catchError, formatCurrency } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";
import { createCustomerSubscriptionAction } from "@/actions/stripe/create-subscription";

export default function DashboardBillingPlanCard({ plan }: BillingPlan) {
  const { push } = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // Plan id is equal to Price Id (Product identifier in Stripe)
  function handleSubscribeToPlan(planId: string) {
    startTransition(async () => {
      try {
        const { clientSecret, subscriptionId } =
          await createCustomerSubscriptionAction(planId);

        if (clientSecret && subscriptionId) {
          push(`/checkout?id=${subscriptionId}&client_secret=${clientSecret}`);
        }
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
