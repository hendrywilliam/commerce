import PageLayout from "@/components/layouts/page-layout";
import Link from "next/link";

export default function OrderStatusNotFoundPage() {
  return (
    <PageLayout>
      <Link className="inline-flex gap-2 text-gray-400" href={"/"}>
        Back to Lobby
      </Link>
      <h1 className="font-bold text-xl">No order found.</h1>
    </PageLayout>
  );
}
