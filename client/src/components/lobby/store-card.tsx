import Link from "next/link";
import type { Store } from "@/db/schema";
import { getRandomPatternStyle } from "@/lib/generate-pattern";

export type StoreCardProps = {
  store: Omit<Store, "createdAt">;
};

export default function StoreCard({ store }: StoreCardProps) {
  return (
    <div className="relative h-48 w-full rounded border shadow">
      {store.active ? (
        <div className="absolute right-2 top-2 rounded-md border border-none bg-green-100 px-2 py-1 text-xs font-semibold text-black outline-none">
          Active
        </div>
      ) : (
        <div className="absolute right-2 top-2 rounded-md border border-none bg-gray-200 px-2 py-1 text-xs font-semibold text-black outline-none">
          Not active
        </div>
      )}
      <Link href={`/store/${store.slug}`}>
        <div
          className="h-4/6"
          style={getRandomPatternStyle(String(store.id))}
        ></div>
        <div className="h-2/6 border-t p-2">
          <p className="font-semibold">{store.name}</p>
          <p className="truncate text-sm text-gray-400">{store.description}</p>
        </div>
      </Link>
    </div>
  );
}
