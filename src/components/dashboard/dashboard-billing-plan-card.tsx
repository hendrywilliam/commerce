"use client";

import type { BillingPlan } from "@/types";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import { IconLoading } from "@/components/ui/icons";

export default function DashboardBillingPlanCard({ plan }: BillingPlan) {
  const [isLoading, setIsLoading] = useState(false);
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
        <Button className="w-full">
          Change plan
          {isLoading && <IconLoading />}
        </Button>
      </div>
    </div>
  );
}
