import Link from "next/link";
import PageLayout from "@/components/layouts/page-layout";

export default function ProductEditNotFoundPage() {
  return (
    <PageLayout>
      <Link
        className="inline-flex gap-2 text-gray-400"
        href={"/dashboard/stores"}
      >
        Back to Store Dashboard
      </Link>
      <h1 className="font-bold text-xl">No product found.</h1>
    </PageLayout>
  );
}
