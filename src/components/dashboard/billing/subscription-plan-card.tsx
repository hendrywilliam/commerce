"use client";

import { IconLoading } from "@/components/ui/icons";
import { useTransition } from "react";
import { BillingPlan } from "@/types";
import { Button } from "@/components/ui/button";
import { catchError, formatCurrency } from "@/lib/utils";
import { manageSubscriptionAction } from "@/actions/stripe/manage-subscription";

interface BillingPlanCardProps extends BillingPlan {}

export default function DashboardBillingPlanCard({
  description,
  id,
  price,
  title,
  advantages,
}: BillingPlanCardProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <div
      className="flex flex-col border rounded justify-between shadow-sm"
      key={id}
    >
      <div className="flex w-full justify-between p-4">
        <div>
          <p className="font-bold text-lg">{title}</p>
          <p className="text-gray-500 text-sm">{description}</p>
        </div>
        <div>
          {title !== "Hobby" ? (
            <>
              <p>{formatCurrency(price)}</p>
              <p className="text-sm text-gray-500 text-end">Monthly</p>
            </>
          ) : (
            <p>FREE</p>
          )}
        </div>
      </div>
      <div className="flex border-t border-dashed p-4 justify-between">
        <div className="inline-flex text-sm gap-2 text-gray-500">
          {advantages.map((advantage, index) => (
            <p key={index}>{advantage}</p>
          ))}
        </div>
        <div>
          {title !== "Hobby" ? (
            <Button
              onClick={() =>
                startTransition(async () => {
                  try {
                    // Plan id is equal to Price Id (Product identifier in Stripe)
                    const session = await manageSubscriptionAction({
                      subscriptionPriceId: id as string,
                    });

                    if (session) {
                      window.location.href =
                        session.url ?? "/dashboard/billing";
                    }
                  } catch (error) {
                    catchError(error);
                  }
                })
              }
              disabled={isPending}
              aria-disabled={isPending ? "true" : "false"}
              className="flex gap-2"
            >
              Change Plan
              {isPending && <IconLoading />}
            </Button>
          ) : (
            <Button disabled={true}>Current Plan</Button>
          )}
        </div>
      </div>
    </div>
  );
}
