import Link from "next/link";
import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { stores } from "@/db/schema";
import { currentUser } from "@clerk/nextjs";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { UserObjectCustomized } from "@/types";
import { WarningIcon } from "@/components/ui/icons";
import { notFound, redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { get_store_balance_fetcher } from "@/fetchers/stores/get-store-balance";
import StorefrontDangerZone from "@/components/dashboard/stores/store-front-danger-zone";
import StorefrontGeneralZone from "@/components/dashboard/stores/store-front-general-zone";

export default async function DashboardDynamicStorePage({
  params,
}: {
  params: { storeSlug: string };
}) {
  const user = (await currentUser()) as unknown as UserObjectCustomized;

  const store = await db.query.stores.findFirst({
    where: eq(stores.slug, params.storeSlug),
  });

  if (!store) {
    notFound();
  }

  const storeOwned = user.privateMetadata.storeId.find(
    (storeId) => storeId === String(store.id),
  );

  if (!storeOwned) {
    redirect("/dashboard/stores");
  }

  const { availableBalance, pendingBalance } = await get_store_balance_fetcher(
    store.id,
  );

  return (
    <div>
      <div className="h-1/2 w-full">
        {!store.active && (
          <div className="mb-4">
            <Alert
              variant="default"
              className="border-yellow-400 bg-yellow-400/10"
            >
              <WarningIcon className="w-4 h-4" />
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>
                In order to start accepting payments, you have to{" "}
                <span className="font-semibold">activate</span> your store
                first.
              </AlertDescription>
            </Alert>
          </div>
        )}
        <div className="w-full inline-flex">
          <div className="w-full">
            <h1 className="font-bold text-2xl">General</h1>
            <p className="text-gray-500">
              Public store information. Your users can see this information.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`${store.slug}/products`}
              className={buttonVariants({ class: "w-full" })}
            >
              Products
            </Link>
            <Link
              href={`${store.slug}/orders`}
              className={buttonVariants({ class: "w-full" })}
            >
              Orders
            </Link>
          </div>
        </div>
      </div>
      <Separator />
      <div className="mt-6 space-y-6">
        <div className="border rounded p-4 shadow-sm">
          <ul className="flex flex-col text-gray-500 gap-1">
            <li>
              <Badge variant={store.active ? "default" : "destructive"}>
                {store.active ? "Active" : "Not Active"}
              </Badge>
            </li>
            <li>
              <p>{store.name}</p>
            </li>
            <li>
              <p>
                <span>{formatCurrency(availableBalance)}</span>
              </p>
            </li>
            {!!pendingBalance && (
              <li>
                <p>
                  You have <span>{formatCurrency(pendingBalance)}</span> pending
                  balance, make sure to complete the onboarding process.
                </p>
              </li>
            )}
          </ul>
        </div>
        <StorefrontGeneralZone store={store} />
        <StorefrontDangerZone storeId={store.id} />
      </div>
    </div>
  );
}
