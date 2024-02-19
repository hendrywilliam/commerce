import Link from "next/link";
import PageLayout from "@/components/layouts/page-layout";

export default function PurchaseNotFoundPage() {
  return (
    <div>
      <Link
        className="inline-flex gap-2 text-gray-400"
        href="/dashboard/stores"
      >
        Back to Dashboard
      </Link>
      <h1 className="font-bold text-xl">No purchase history found.</h1>
    </div>
  );
}
