import { beautifyId } from "@/lib/utils";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { UserObjectCustomized } from "@/types";
import { subscriptionPlans } from "@/config/billing";
import SubscriptionPlanCard from "@/components/dashboard/subscription/subscription-plan-card";
import { get_current_subscription_fetcher } from "@/fetchers/stripe/get-current-subscription";

export default async function DashboardBillingPage() {
    const user = (await currentUser()) as unknown as UserObjectCustomized;

    if (!user) {
        redirect("/sign-in");
    }

    const metadata = user.privateMetadata;
    const currentPlan = subscriptionPlans.find(
        (plan) => plan.id === metadata.subscribedPlanId
    );
    let subscribedPlanDetails =
        currentPlan?.title !== "Hobby"
            ? await get_current_subscription_fetcher(
                  metadata.stripeSubscriptionId
              )
            : null;

    return (
        <div className="flex w-full flex-col space-y-6">
            <section className="inline-flex w-full pb-4">
                <div className="w-full">
                    <h1 className="text-2xl font-bold">Subscription</h1>
                    <p className="text-gray-500">
                        Manage your current subscription plan
                    </p>
                </div>
            </section>
            <section className="flex flex-col gap-4">
                <h2>Active Plan</h2>
                <div className="w-full rounded border lg:w-1/2">
                    <div className="flex justify-between p-4">
                        <div>
                            <p className="text-sm text-gray-500">
                                Current plan
                            </p>
                            <p>{currentPlan?.title}</p>
                        </div>
                        {subscribedPlanDetails && (
                            <div>
                                <p className="text-gray-500">
                                    Subscription ID: #
                                    {beautifyId(
                                        subscribedPlanDetails.subscribedPlanId
                                    )}
                                </p>
                            </div>
                        )}
                    </div>
                    {subscribedPlanDetails && (
                        <div className="flex justify-between border-t border-dashed p-4">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Renew on{" "}
                                    {subscribedPlanDetails.subscribedPlanEnd}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    Paid with {subscribedPlanDetails.cardBrand}{" "}
                                    ending {subscribedPlanDetails.cardLastFour}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </section>
            <section className="mt-6 flex h-full w-full flex-col gap-4">
                <h2>Select Plan</h2>
                <div className="w-full space-y-3 lg:w-1/2">
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
