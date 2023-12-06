import { Product } from "@/db/schema";
import DashboardStoreProductShellTable from "./store-product-shell-table";

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
