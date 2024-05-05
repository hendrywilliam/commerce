import Link from "next/link";
import { db } from "@/db/core";
import { UserObjectCustomized } from "@/types";
import { currentUser } from "@clerk/nextjs";
import { inArray } from "drizzle-orm";
import { buttonVariants } from "@/components/ui/button";
import { stores as storeSchema } from "@/db/schema";
import StoreListShellTables from "@/components/dashboard/stores/store-list-shell-table";

export default async function DashboardPage() {
  const user = (await currentUser()) as unknown as UserObjectCustomized;
  const userStores = user.privateMetadata.storeId;
  const stores =
    userStores.length > 0
      ? await db
          .select()
          .from(storeSchema)
          .where(inArray(storeSchema.id, userStores))
      : [];

  return (
    <div className="h-full">
      <div className="mb-4 flex w-full justify-between">
        <h1 className="font-bold">Stores</h1>
        <Link
          className={buttonVariants({ variant: "outline", size: "sm" })}
          href="/dashboard/stores/new-store"
        >
          Create Store
        </Link>
      </div>
      <StoreListShellTables stores={stores} />
    </div>
  );
}
