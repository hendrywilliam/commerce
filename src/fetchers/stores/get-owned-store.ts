import { currentUser } from "@clerk/nextjs";
import { UserObjectCustomized } from "@/types";
import { eq, sql } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db/core";
import {
  Store,
  stores,
  products as productsSchema,
  orders as ordersSchema,
  payments,
} from "@/db/schema";
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

  const [storeBalance, products, orders, payment] = await Promise.all([
    await getStoreBalanceFetcher(store.id),
    await db
      .select()
      .from(productsSchema)
      .where(eq(productsSchema.storeId, store.id))
      .limit(10),
    await db
      .select()
      .from(ordersSchema)
      .where(eq(ordersSchema.storeId, store.id))
      .limit(10),
    await db.query.payments.findFirst({
      where: eq(payments.storeId, store.id),
    }),
  ]);

  return {
    storeBalance,
    products,
    orders,
    store,
    payment,
  };
}
