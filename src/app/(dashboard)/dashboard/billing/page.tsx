import { unixToDateString } from "@/lib/utils";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";
import { UserObjectCustomized } from "@/types";
import { billingPlan } from "@/config/billing";
import DashboardBillingPlanCard from "@/components/dashboard/billing-plan-card";
import { getCurrentSubscriptionAction } from "@/actions/stripe/get-current-subscription";

export default async function DashboardBillingPage() {
  const user = await currentUser();

  // Middleware will handle this.
  if (!user) {
    redirect("/sign-in");
  }

  const userPrivateMetadata = (user as UserObjectCustomized).privateMetadata;

  const userSubscribedPlan =
    userPrivateMetadata.stripeSubscriptionId &&
    (await getCurrentSubscriptionAction(
      userPrivateMetadata.stripeSubscriptionId,
    ));

  const findUserPlan =
    userSubscribedPlan &&
    billingPlan.find((plan) => plan.id === userSubscribedPlan.subscribedPlanId);

  return (
    <div className="h-1/2 w-full">
      <div className="w-full inline-flex border-b pb-4">
        <div className="w-full">
          <h1 className="font-bold text-2xl w-[75%]">Billing</h1>
          <p className="w-[75%]">
            Your current plan:{" "}
            <span className="font-semibold">
              {findUserPlan ? findUserPlan.title : "Hobby"}
            </span>
          </p>
          {findUserPlan && (
            <div className="text-xs inline-flex">
              <p>{unixToDateString(userSubscribedPlan.subscribedPlanStart)}</p>
              <p> — </p>
              <p>{unixToDateString(userSubscribedPlan.subscribedPlanEnd)}</p>
            </div>
          )}
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
