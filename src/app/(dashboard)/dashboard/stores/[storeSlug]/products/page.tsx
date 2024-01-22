interface DashboardStoreProductsPageProps {
  params: {
    storeSlug: string;
  };
  searchParams: {
    page: string;
    page_size: string;
    [key: string]: string;
  };
}

export default function DashboardStoreProductsPage({
  params,
  searchParams,
}: DashboardStoreProductsPageProps) {
  return <div>page</div>;
}
