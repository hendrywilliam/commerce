import DashboardStoreTransactionData from "./store-transaction-data";

interface DashboardStoreTransactionTab {
  active: boolean;
}

export default function DashboardStoreTransactionTab({
  active,
}: DashboardStoreTransactionTab) {
  return <DashboardStoreTransactionData />;
}
