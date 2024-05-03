import StoreListShellTables from "@/components/dashboard/stores/store-list-shell-table";
import { db } from "@/db/core";
import { stores as storeSchema } from "@/db/schema";
import { UserObjectCustomized } from "@/types";
import { currentUser } from "@clerk/nextjs";
import { inArray } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default async function DashboardPage() {
  const user = (await currentUser()) as unknown as UserObjectCustomized;
  if (!user) {
    redirect("/");
  }
  const userStores = user.privateMetadata.storeId;
  const stores =
    userStores.length > 0
      ? await db
          .select()
          .from(storeSchema)
          .where(inArray(storeSchema.id, user.privateMetadata.storeId ?? []))
      : [];

  return (
    <div className="h-full">
      <div className="mb-4 flex w-full justify-between">
        <h1>Stores</h1>
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
