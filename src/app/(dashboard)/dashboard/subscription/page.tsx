import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";
import { UserObjectCustomized } from "@/types";
import { subscriptionPlans } from "@/config/billing";
import SubscriptionPlanCard from "@/components/dashboard/billing/subscription-plan-card";
import { get_current_subscription_fetcher } from "@/fetchers/stripe/get-current-subscription";

export default async function DashboardBillingPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const userPrivateMetadata = (user as UserObjectCustomized).privateMetadata;

  const userSubscribedPlan =
    userPrivateMetadata.stripeSubscriptionId &&
    (await get_current_subscription_fetcher(
      userPrivateMetadata.stripeSubscriptionId,
    ));

  const currentUserPlan =
    userSubscribedPlan &&
    subscriptionPlans.find(
      (plan) => plan.id === userSubscribedPlan.subscribedPlanId,
    );

  return (
    <div className="h-1/2 w-full">
      <div className="w-full inline-flex pb-4">
        <div className="w-full">
          <h1 className="font-bold text-2xl">Subscription</h1>
          <p className="text-gray-500">Manage your current subscription plan</p>
        </div>
      </div>
      <div className="h-full w-full flex flex-col mt-6 gap-4">
        <h1 className="text-xl">Select Plan</h1>
        <div className="w-full lg:w-1/2 space-y-3">
          {subscriptionPlans.map((plan) => {
            return (
              <SubscriptionPlanCard
                advantages={plan.advantages}
                description={plan.description}
                id={plan.id}
                limit={plan.limit}
                price={plan.price}
                title={plan.title}
                key={plan.id}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
