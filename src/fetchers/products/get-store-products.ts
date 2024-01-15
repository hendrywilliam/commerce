import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { products, stores } from "@/db/schema";

export async function get_store_product_fetcher(storeSlug: string) {
  const store = await db.query.stores.findFirst({
    where: eq(stores.slug, storeSlug),
  });

  return store
    ? await db
        .select()
        .from(products)
        .orderBy(products.id)
        .where(eq(products.storeId, store.id))
        .limit(10)
        .execute()
    : [];
}
