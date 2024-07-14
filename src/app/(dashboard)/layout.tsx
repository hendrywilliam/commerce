import DashboardNavigation from "@/components/dashboard/dashboard-navigation";
import { db } from "@/db/core";
import { stores as storesSchema } from "@/db/schema";
import { UserObjectCustomized } from "@/types";
import { currentUser } from "@clerk/nextjs/server";
import { inArray } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: React.PropsWithChildren) {
    const user = (await currentUser()) as unknown as UserObjectCustomized;
    if (!user) {
        redirect("/");
    }
    const userStores = user.privateMetadata.storeId;
    const stores =
        userStores.length > 0
            ? await db
                  .select()
                  .from(storesSchema)
                  .where(inArray(storesSchema.id, userStores))
            : [];

    return (
        <div className="h-full min-h-screen w-full text-sm">
            <div className="flex h-full flex-col">
                <DashboardNavigation
                    firstname={user.firstName}
                    lastname={user.lastName}
                    stores={stores}
                />
                <div className="flex h-full flex-col overflow-y-auto">
                    <div className="container h-full py-6">{children}</div>
                </div>
            </div>
        </div>
    );
}
