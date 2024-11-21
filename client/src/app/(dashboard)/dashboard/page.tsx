import { db } from "@/db/core";
import { UserObjectCustomized } from "@/types";
import { inArray } from "drizzle-orm";
import { stores as storeSchema } from "@/db/schema";
import StoreListShellTables from "@/components/dashboard/stores/store-list-shell-table";
import StoreFormDialog from "@/components/dashboard/stores/store-form-dialog";
import { currentUser } from "@clerk/nextjs/server";

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
                <StoreFormDialog storeStatus="new-store" />
            </div>
            <StoreListShellTables stores={stores} />
        </div>
    );
}
