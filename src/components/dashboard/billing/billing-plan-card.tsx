"use client";

import { useTransition } from "react";
import type { BillingPlan } from "@/types";
import { Button } from "@/components/ui/button";
import { catchError, formatCurrency } from "@/lib/utils";
import { manageSubscriptionAction } from "@/actions/stripe/manage-subscription";
import {
  IconLoading,
  IconArrowForward,
  CheckmarkIcon,
} from "@/components/ui/icons";

interface DashboardBillingPlanCard extends BillingPlan {
  stripeCustomerId: string;
}

export default function DashboardBillingPlanCard({
  plan,
}: DashboardBillingPlanCard) {
  const [isPending, startTransition] = useTransition();

  return (
    <div
      className="flex flex-col border rounded p-4 h-96 max-h-fit justify-between shadow-sm"
      key={plan.id}
    >
      <div>
        <h1 className="text-xl font-bold">{plan.title}</h1>
        <p className="text-xl mt-2 font-bold">
          {formatCurrency(plan.price)}{" "}
          <span className="text-sm font-normal">per month</span>
        </p>
        <p className="text-gray-500 text-sm">{plan.description}</p>
        <div className="my-4">
          <ul className="flex flex-col gap-2">
            {plan.advantages.map((advantage, index) => (
              <li
                className="inline-flex items-center gap-2 text-gray-500"
                key={index}
              >
                <CheckmarkIcon />
                <span>{advantage}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        {plan.title !== "Hobby" && (
          <Button
            onClick={() =>
              startTransition(async () => {
                try {
                  // Plan id is equal to Price Id (Product identifier in Stripe)
                  const session = await manageSubscriptionAction({
                    subscriptionPriceId: plan.id as string,
                  });

                  if (session) {
                    window.location.href = session.url ?? "/dashboard/billing";
                  }
                } catch (error) {
                  catchError(error);
                }
              })
            }
            disabled={isPending}
            aria-disabled={isPending ? "true" : "false"}
            className="flex gap-2 w-full"
          >
            Change Plan
            {isPending ? <IconLoading /> : <IconArrowForward />}
          </Button>
        )}
      </div>
    </div>
  );
}
