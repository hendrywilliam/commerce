import { currentUser } from "@clerk/nextjs";
import { UserObjectCustomized } from "@/types";
import { eq, sql } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db/core";
import { Store, stores, products, orders } from "@/db/schema";
import { getStoreBalanceFetcher } from "./get-store-balance";
import { redirect } from "next/navigation";

export async function getOwnedStoreFetcher({ slug }: { slug: Store["slug"] }) {
  const user = (await currentUser()) as unknown as UserObjectCustomized;

  const store = await db.query.stores.findFirst({
    where: eq(stores.slug, slug),
  });

  if (!store) {
    notFound();
  }

  const storeOwned = user.privateMetadata.storeId.find(
    (storeId) => storeId === store.id,
  );

  if (!storeOwned) {
    redirect("/dashboard/stores");
  }

  const [storeBalance, productsCount, ordersCount] = await Promise.all([
    await getStoreBalanceFetcher(store.id),
    await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(products)
      .where(eq(products.storeId, store.id))
      .limit(1),
    await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(orders)
      .where(eq(orders.storeId, store.id))
      .limit(1),
  ]);

  return {
    storeBalance,
    productsCount,
    ordersCount,
    store,
  };
}
