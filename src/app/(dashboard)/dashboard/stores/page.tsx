import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function DashboardStoresPage() {
  return (
    <div className="w-full">
      <div className="w-full inline-flex border-b pb-4">
        <div className="w-full">
          <h1 className="font-bold text-2xl w-[75%]">Stores</h1>
          <p className="w-[75%]">Manage your stores or create a new one.</p>
        </div>
        <div className="flex-1">
          <Link
            className={buttonVariants({ class: "w-max" })}
            href={"stores/new-store"}
          >
            Create Store
          </Link>
        </div>
      </div>
    </div>
  );
}
