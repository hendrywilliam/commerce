import type { Store } from "@/db/schema";
import { getRandomPatternStyle } from "@/lib/generate-pattern";

export type FeaturedStore = {
  store: Omit<Store, "createdAt">;
};

export default function FeaturedStoreCard({ store }: FeaturedStore) {
  return (
    <div className="relative h-48 w-full border rounded">
      {store.active ? (
        <div className="absolute top-2 right-2 px-2 py-1 border rounded-md bg-green-100 text-black outline-none border-none text-xs font-semibold">
          Active
        </div>
      ) : (
        <div className="absolute top-2 right-2 px-2 py-1 border rounded-md bg-gray-200 text-black outline-none border-none text-xs font-semibold">
          Not active
        </div>
      )}
      <div
        className="h-4/6"
        style={getRandomPatternStyle(String(store.id))}
      ></div>
      <div className="h-2/6 border-t p-2">
        <p className="font-semibold">{store.name}</p>
        <p className="text-sm text-gray-400 truncate">{store.description}</p>
      </div>
    </div>
  );
}
