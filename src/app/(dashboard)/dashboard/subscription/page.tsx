import { beautifyId } from "@/lib/utils";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";
import { UserObjectCustomized } from "@/types";
import { subscriptionPlans } from "@/config/billing";
import SubscriptionPlanCard from "@/components/dashboard/billing/subscription-plan-card";
import { get_current_subscription_fetcher } from "@/fetchers/stripe/get-current-subscription";

export default async function DashboardBillingPage() {
  const user = (await currentUser()) as unknown as UserObjectCustomized;

  if (!user) {
    redirect("/sign-in");
  }

  // DISGUSTING
  const metadata = user.privateMetadata;
  const currentPlan = subscriptionPlans.find(
    (plan) => plan.id === metadata.subscribedPlanId,
  );
  let subscribedPlanDetails =
    currentPlan?.title !== "Hobby"
      ? await get_current_subscription_fetcher(metadata.stripeSubscriptionId)
      : null;

  return (
    <div className="flex flex-col space-y-6 w-full">
      <section className="w-full inline-flex pb-4">
        <div className="w-full">
          <h1 className="font-bold text-2xl">Subscription</h1>
          <p className="text-gray-500">Manage your current subscription plan</p>
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <h2>Active Plan</h2>
        <div className="w-full lg:w-1/2 border rounded">
          <div className="flex justify-between p-4">
            <div>
              <p className="text-gray-500 text-sm">Current plan</p>
              <p>{currentPlan?.title}</p>
            </div>
            {subscribedPlanDetails && (
              <div>
                <p className="text-gray-500">
                  #{beautifyId(subscribedPlanDetails.subscribedPlanId)}
                </p>
              </div>
            )}
          </div>
          {subscribedPlanDetails && (
            <div className="flex justify-between border-t border-dashed p-4">
              <div>
                <p className="text-sm text-gray-500">
                  Renew on {subscribedPlanDetails.subscribedPlanEnd}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  Paid with {subscribedPlanDetails.cardBrand} ending{" "}
                  {subscribedPlanDetails.cardLastFour}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
      <section className="h-full w-full flex flex-col mt-6 gap-4">
        <h2>Select Plan</h2>
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
      </section>
    </div>
  );
}
