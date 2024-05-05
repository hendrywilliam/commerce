import Link from "next/link";
import { db } from "@/db/core";
import { stores } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";
import { UserObjectCustomized } from "@/types";
import { AddStoreIcon, PlusIcon } from "@/components/ui/icons";
import { buttonVariants } from "@/components/ui/button";
import DashboardStoreCard from "@/components/dashboard/stores/store-card";

export default async function DashboardStoresPage() {
  const user = (await currentUser()) as unknown as UserObjectCustomized;
  const userPrivateMetadata = user.privateMetadata;
  const userStores =
    userPrivateMetadata.storeId.length > 0
      ? await db
          .select()
          .from(stores)
          .where(
            inArray(
              stores.id,
              userPrivateMetadata.storeId.map((item) => {
                return Number(item);
              }),
            ),
          )
      : [];

  return (
    <div className="h-1/2 w-full">
      <div className="inline-flex w-full">
        <div className="flex w-full justify-end">
          <Link
            className={buttonVariants({
              variant: "outline",
              class: "inline-flex gap-2",
            })}
            href="stores/new-store"
          >
            New Store
            <PlusIcon />
          </Link>
        </div>
      </div>
      {userStores.length > 0 ? (
        <div className="mt-6 grid h-full w-full grid-cols-3 gap-4">
          {userStores.map((store) => {
            return <DashboardStoreCard store={store} key={store.id} />;
          })}
        </div>
      ) : (
        <div className="mt-4 flex w-full flex-col items-center justify-center gap-4 rounded border p-6 py-24 text-center shadow-sm">
          <AddStoreIcon className="h-6 w-6" />
          <h1 className="text-2xl">Looks like you dont have any store.</h1>
          <p className="text-gray-500">
            Create your first store to get started.
          </p>
          <Link
            className={buttonVariants({
              variant: "outline",
            })}
            href="stores/new-store"
          >
            Get Started
          </Link>
        </div>
      )}
    </div>
  );
}
