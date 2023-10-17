import { db } from "@/db/core";
import { stores } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardStoreFront from "@/components/dashboard/dashboard-store-front";

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

  return (
    <div>
      <div className="h-1/2 w-full">
        <div className="w-full inline-flex border-b pb-4">
          <div className="w-full">
            <h1 className="font-bold text-2xl w-[75%]">{store.name}</h1>
            <p className="w-[75%]">Your current store information lies here.</p>
          </div>
          <div className="flex-1">
            <Button className="w-max">Add product</Button>
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
            <DashboardStoreFront store={store} />
          </TabsContent>
          <TabsContent value="products">Change your password here.</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
