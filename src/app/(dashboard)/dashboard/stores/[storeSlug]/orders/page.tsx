import { db } from "@/db/core";
import { and, like, eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs";
import { orders, stores } from "@/db/schema";
import { UserObjectCustomized } from "@/types";
import { notFound, redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import OrdersHistoryShellTable from "@/components/dashboard/stores/orders/orders-history-shell-table";

interface DashboardStoreOrdersPageProps {
  params: {
    storeSlug: string;
    [key: string]: string;
  };
  searchParams: {
    name: string;
    page: string;
  };
}

export default async function DashboardStoreOrdersPage({
  params,
  searchParams,
}: DashboardStoreOrdersPageProps) {
  const customerName = searchParams.name;
  const slug = params.storeSlug;
  const page = isNaN(Number(searchParams.page)) ? 1 : Number(searchParams.page);
  const pageSize = 10;

  const user = (await currentUser()) as unknown as UserObjectCustomized;

  const store = await db.query.stores.findFirst({
    where: eq(stores.slug, slug),
  });

  if (!store) {
    notFound();
  }

  const isStoreOwner = user.privateMetadata.storeId.includes(String(store.id));

  if (!isStoreOwner) {
    redirect("/dashboard/stores");
  }

  const storeOrders = await db
    .select()
    .from(orders)
    .where(
      and(
        customerName ? like(orders.name, `%${customerName}%`) : undefined,
        eq(orders.storeId, store.id),
      ),
    )
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  return (
    <div>
      <div className="w-full flex">
        <div className="w-full">
          <h1 className="font-bold text-2xl">Orders</h1>
          <p className="text-gray-500">List of store orders.</p>
        </div>
      </div>
      <Separator />
      <OrdersHistoryShellTable orders={storeOrders} />
    </div>
  );
}
