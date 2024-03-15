import Link from "next/link";
import { currentUser } from "@clerk/nextjs";
import { UserObjectCustomized } from "@/types";
import { dashboardNavigation } from "@/config/site";
import { siteStaticMetadata } from "@/config/site";
import type { Metadata, ResolvingMetadata } from "next";
import { AddStoreIcon, PurchaseIcon } from "@/components/ui/icons";
import { buttonVariants } from "@/components/ui/button";
import { db } from "@/db/core";
import { redirect } from "next/navigation";
import { orders, products } from "@/db/schema";
import { eq, inArray, sql } from "drizzle-orm";

export async function generateMetadata(
  {},
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: "Overview — Dashboard",
    description: "Overview of your stores, products, incomes, orders.",
    ...siteStaticMetadata,
  };
}

export default async function DashboardPage() {
  const user = (await currentUser()) as unknown as UserObjectCustomized;

  if (!user) {
    redirect("/sign-in");
  }

  const userOwnedStoresId = user.privateMetadata.storeId.map((storeId) =>
    typeof storeId === "string" ? Number(storeId) : storeId,
  );

  // Gyat daym this is so ugly.
  const [storesProducts, totalOrders, totalPurchase] = await Promise.all([
    userOwnedStoresId.length > 0
      ? await db
          .select({
            count: sql<number>`count('*')`,
          })
          .from(products)
          .where(inArray(products.storeId, [...userOwnedStoresId]))
          .execute()
          .then((result) => result[0].count)
      : 0,
    userOwnedStoresId.length > 0
      ? await db
          .select({ count: sql<number>`count('*')` })
          .from(orders)
          .where(inArray(orders.storeId, [...userOwnedStoresId]))
          .execute()
          .then((result) => result[0].count)
      : 0,
    user
      ? await db
          .select({ count: sql<number>`count('*')` })
          .from(orders)
          .where(eq(orders.userId, user.id))
          .execute()
          .then((result) => result[0].count)
      : 0,
  ]);

  return (
    <div className="h-full">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold">Overview</h1>
        <p className="text-gray-500">This is what we`ve got for you today.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 *:bg-white lg:grid-cols-4">
        <div className="flex h-52 w-full flex-col rounded border p-6 shadow-sm">
          <div className="inline-flex w-full items-center justify-between">
            <p>Stores</p>
            <AddStoreIcon className="h-6 w-6" />
          </div>
          <div className="mt-4 flex flex-1 flex-col justify-between">
            <h1 className="text-3xl font-bold">
              {user.privateMetadata.storeId.length}
            </h1>
            <div>
              <Link
                href="/stores"
                className={buttonVariants({ variant: "outline" })}
              >
                View Stores
              </Link>
            </div>
          </div>
        </div>
        <div className="flex h-52 w-full flex-col rounded border p-6 shadow-sm">
          <div className="inline-flex w-full items-center justify-between">
            <p>Products</p>
            <AddStoreIcon className="h-6 w-6" />
          </div>
          <div className="mt-4 flex flex-1 flex-col justify-between">
            <h1 className="text-3xl font-bold">{storesProducts}</h1>
            <div>
              <Link
                href="/dashboard/stores"
                className={buttonVariants({ variant: "outline" })}
              >
                View Stores Products
              </Link>
            </div>
          </div>
        </div>
        <div className="flex h-52 w-full flex-col rounded border p-6 shadow-sm">
          <div className="inline-flex w-full items-center justify-between">
            <p>Orders</p>
            <AddStoreIcon className="h-6 w-6" />
          </div>
          <div className="mt-4 flex flex-1 flex-col justify-between">
            <h1 className="text-3xl font-bold">{totalOrders}</h1>
            <div>
              <Link
                href="/dashboard/stores"
                className={buttonVariants({ variant: "outline" })}
              >
                View Stores Orders
              </Link>
            </div>
          </div>
        </div>
        <div className="flex h-52 w-full flex-col rounded border p-6 shadow-sm">
          <div className="inline-flex w-full items-center justify-between">
            <p>Purchase</p>
            <PurchaseIcon className="h-6 w-6" />
          </div>
          <div className="mt-4 flex flex-1 flex-col justify-between">
            <h1 className="text-3xl font-bold">{totalPurchase}</h1>
            <div>
              <Link
                href="/dashboard/purchase"
                className={buttonVariants({ variant: "outline" })}
              >
                View Purchase
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
