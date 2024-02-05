import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { stores } from "@/db/schema";

interface DashboardStoreOrdersPageProps {
  params: {
    storeSlug: string;
    [key: string]: string;
  };
}

export default async function DashboardStoreOrdersPage({
  params,
}: DashboardStoreOrdersPageProps) {
  const slug = params.storeSlug;

  const getStore = await db.query.stores.findFirst({
    where: eq(stores.slug, slug),
  });

  return <div>{store}</div>;
}
