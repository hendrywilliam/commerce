import Link from "next/link";
import PageLayout from "@/components/layouts/page-layout";

export default function StoreOrderHistoryNotFoundPage() {
  return (
    <PageLayout>
      <Link
        className="inline-flex gap-2 text-gray-400"
        href={"/dashboard/stores"}
      >
        Back to Dashboard
      </Link>
      <h1 className="font-bold text-xl">No order found.</h1>
    </PageLayout>
  );
}
