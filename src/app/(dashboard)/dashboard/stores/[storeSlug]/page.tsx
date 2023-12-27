import Link from "next/link";
import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { stores } from "@/db/schema";
import { notFound } from "next/navigation";
import { WarningIcon } from "@/components/ui/icons";
import { buttonVariants } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import DashboardStoreFrontTab from "@/components/dashboard/store-front-tab";
import { getStoreProductsAction } from "@/actions/products/get-store-products";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardStoreProductTab from "@/components/dashboard/store-product-tab";
import DashboardStoreTransactionTab from "@/components/dashboard/store-transaction-tab";

export default async function DashboardDynamicStorePage({
  params,
}: {
  params: { storeSlug: string };
}) {
  const store = await db.query.stores.findFirst({
    where: eq(stores.slug, params.storeSlug),
  });

  if (!store) {
    notFound();
  }

  const storeProductData = await getStoreProductsAction(params.storeSlug);

  return (
    <div>
      <div className="h-1/2 w-full">
        {!store.active && (
          <div className="mb-4">
            <Alert
              variant="default"
              className="border-yellow-400 bg-yellow-400/10"
            >
              <WarningIcon className="w-4 h-4" />
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>
                In order to start accepting payments, you have to{" "}
                <span className="font-semibold">activate</span> your store
                first.
              </AlertDescription>
            </Alert>
          </div>
        )}
        <div className="w-full inline-flex border-b pb-4">
          <div className="w-full">
            <h1 className="font-bold text-2xl w-[75%]">{store.name}</h1>
            <p className="w-[75%]">Your current store information lies here.</p>
          </div>
          <div className="flex-1">
            <Link
              href={`${params.storeSlug}/add-new-product`}
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
            <TabsTrigger value="transaction">Transaction</TabsTrigger>
          </TabsList>
          <TabsContent value="storefront">
            <DashboardStoreFrontTab store={store} />
          </TabsContent>
          <TabsContent value="products">
            <DashboardStoreProductTab storeProductData={storeProductData} />
          </TabsContent>
          <TabsContent value="transaction">
            <DashboardStoreTransactionTab active={store.active} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
