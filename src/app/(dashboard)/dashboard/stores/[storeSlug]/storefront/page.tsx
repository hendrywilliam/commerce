import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { stores } from "@/db/schema";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import DashboardStoreFrontDangerZone from "@/components/dashboard/stores/store-front-danger-zone";
import DashboardStoreFrontGeneralZone from "@/components/dashboard/stores/store-front-general-zone";

interface DashboardStorefrontPageProps {
  params: {
    storeSlug: string;
  };
  searchParams: {
    [key: string]: string;
  };
}

export default async function DashboardStorefrontPage({
  params,
  searchParams,
}: DashboardStorefrontPageProps) {
  const storeSlug = params.storeSlug;

  const store = await db.query.stores.findFirst({
    where: eq(stores.slug, params.storeSlug),
  });

  if (!store) {
    redirect("/dashboard/stores");
  }

  return (
    <div className="flex flex-col">
      <h1 className="font-bold text-xl">General</h1>
      <p className="text-gray-500">This is how others see your store.</p>
      <Separator />
      <DashboardStoreFrontGeneralZone store={store} />
      <DashboardStoreFrontDangerZone id={store.id} />
    </div>
  );
}
