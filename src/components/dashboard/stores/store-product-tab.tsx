import { Product } from "@/db/schema";
import Pagination from "@/components/pagination";
import DashboardStoreProductShellTable from "./store-product-shell-table";

interface DashboardStoreProductTab {
  storeProductData: Product[];
  currentPage: number;
  totalPage: number;
}

export default function DashboardStoreProductTab({
  storeProductData,
  currentPage,
  totalPage,
}: DashboardStoreProductTab) {
  return (
    <div className="my-4">
      <DashboardStoreProductShellTable storeProductData={storeProductData} />
      <Pagination currentPage={currentPage} totalPage={totalPage} />
    </div>
  );
}
