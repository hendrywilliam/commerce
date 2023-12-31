import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { stores } from "@/db/schema";
import { products } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { IconStores } from "@/components/ui/icons";
import ProductCard from "@/components/lobby/product-card";
import { notFound } from "next/navigation";

export default async function StorePage({
  params,
}: {
  params: { storeSlug: string };
}) {
  const storeData = await db.query.stores.findFirst({
    where: eq(stores.slug, params.storeSlug),
  });

  if (!storeData) {
    notFound();
  }

  const productsData = await db
    .select()
    .from(products)
    .orderBy(products.id)
    .where(eq(products.storeId, storeData.id))
    .limit(10);

  return (
    <div className="flex flex-col container h-full w-full py-8">
      <div className="flex flex-col h-full w-full my-2 gap-2">
        <div className="mt-4">
          <div className="flex flex-col my-4 gap-2">
            <h1 className="font-bold text-xl">{storeData?.name}</h1>
            <div>
              <Button variant={"outline"} className="inline-flex gap-2">
                <IconStores />
                Chat Store
              </Button>
            </div>
          </div>
          {productsData.length ? (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {productsData.map((product) => (
                <ProductCard product={product} key={product.id} />
              ))}
            </div>
          ) : (
            <p>No product found</p>
          )}
        </div>
      </div>
    </div>
  );
}
