import { db } from "@/db/core";
import { asc, eq } from "drizzle-orm";
import { products, type Store } from "@/db/schema";
import ProductCard from "@/components/lobby/product-card";

interface MoreStoreProductsProps {
  store: Store;
}

export default async function MoreStoreProducts({
  store,
}: MoreStoreProductsProps) {
  const moreStoreProducts = await db
    .select()
    .from(products)
    .where(eq(products.storeId, store.id))
    .orderBy(products.createdAt, asc(products.id))
    .limit(5);

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-4">
      {moreStoreProducts.map((storeProduct) => (
        <ProductCard key={storeProduct.id} product={storeProduct} />
      ))}
    </div>
  );
}
