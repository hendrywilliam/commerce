import DashboardStoreProductShellTable from "./dashboard-store-product-shell-table";
import { Product } from "@/db/schema";

interface DashboardStoreProductTab {
  storeProductData: Product[];
}

export default function DashboardStoreProductTab({
  storeProductData,
}: DashboardStoreProductTab) {
  return (
    <>
      <DashboardStoreProductShellTable storeProductData={storeProductData} />
    </>
  );
}
