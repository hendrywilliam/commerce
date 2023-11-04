import { db } from "@/db/core";
import { stores } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardStoreFrontTab from "@/components/dashboard/dashboard-store-front-tab";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import DashboardStoreProductTab from "@/components/dashboard/dashboard-store-product-tab";
import { getStoreProductsAction } from "@/actions/products/get-store-products";

export default async function DashboardDynamicStorePage({
  params,
}: {
  params: { storeId: string };
}) {
  const store = (
    await db
      .select()
      .from(stores)
      .where(eq(stores.id, Number(params.storeId)))
  )[0];

  const storeProductData = await getStoreProductsAction(params.storeId);

  return (
    <div>
      <div className="h-1/2 w-full">
        <div className="w-full inline-flex border-b pb-4">
          <div className="w-full">
            <h1 className="font-bold text-2xl w-[75%]">{store.name}</h1>
            <p className="w-[75%]">Your current store information lies here.</p>
          </div>
          <div className="flex-1">
            <Link
              href={`${params.storeId}/add-new-product`}
              className={buttonVariants({ class: "w-max" })}
            >
              Add product
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <Tabs defaultValue="storefront" className="w-full">
          <TabsList>
            <TabsTrigger value="storefront">Storefront</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
          </TabsList>
          <TabsContent value="storefront">
            <DashboardStoreFrontTab store={store} />
          </TabsContent>
          <TabsContent value="products">
            <DashboardStoreProductTab storeProductData={storeProductData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
