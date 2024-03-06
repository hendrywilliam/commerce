import Link from "next/link";
import { db } from "@/db/core";
import { stores } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";
import { UserObjectCustomized } from "@/types";
import { buttonVariants } from "@/components/ui/button";
import DashboardStoreCard from "@/components/dashboard/stores/store-card";

export default async function DashboardStoresPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const userPrivateMetadata = (user as UserObjectCustomized).privateMetadata;
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
            })}
            href="stores/new-store"
          >
            New Store
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
        <div className="mt-6">
          <p>
            You dont have any store to manage,{" "}
            <span className="font-semibold">try create a new one.</span>
          </p>
        </div>
      )}
    </div>
  );
}
