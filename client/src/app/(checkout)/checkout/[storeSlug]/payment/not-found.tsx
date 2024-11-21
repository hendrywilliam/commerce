import PageLayout from "@/components/layouts/page-layout";
import Link from "next/link";

export default function PaymentNotFoundPage() {
  return (
    <PageLayout>
      <Link className="text-gray-400" href="/">
        Back to Lobby
      </Link>
      <h1 className="text-xl font-bold">No payment found.</h1>
    </PageLayout>
  );
}
