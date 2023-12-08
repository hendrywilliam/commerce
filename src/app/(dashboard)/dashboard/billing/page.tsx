import { redirect } from "next/navigation";
import { billingPlan } from "@/config/billing";
import { currentUser } from "@clerk/nextjs";
import DashboardBillingPlanCard from "@/components/dashboard/billing-plan-card";
import { UserObjectCustomized } from "@/types";

export default async function DashboardBillingPage() {
  const user = await currentUser();

  // Middleware will handle this.
  if (!user) {
    redirect("/sign-in");
  }

  const userPrivateMetadata = (user as UserObjectCustomized).privateMetadata;

  return (
    <div className="h-1/2 w-full">
      <div className="w-full inline-flex border-b pb-4">
        <div className="w-full">
          <h1 className="font-bold text-2xl w-[75%]">Billing</h1>
          <p className="w-[75%]">
            Your current plan: <span className="font-semibold">Hobby</span>
          </p>
        </div>
      </div>
      <div className="h-full w-full grid grid-cols-3 mt-6 gap-4">
        {billingPlan.map((plan) => {
          return (
            <DashboardBillingPlanCard
              plan={plan}
              key={plan.id}
              stripeCustomerId={userPrivateMetadata.stripeCustomerId}
            />
          );
        })}
      </div>
    </div>
  );
}
