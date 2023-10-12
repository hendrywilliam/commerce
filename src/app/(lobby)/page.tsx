import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import CategoriesShowcase from "@/components/categories-showcase";
import FeaturedStoreCard from "@/components/cards/featured-store-card";
import { db } from "@/db/core";
import { stores } from "@/db/schema";
import { Store } from "@/db/schema";

export default async function IndexPage() {
  const featuredStore = (await db.select().from(stores).limit(4)) as Omit<
    Store,
    "createdAt"
  >[];

  return (
    <div className="flex flex-col container h-full w-full items-center py-8">
      <section className="flex flex-col h-max w-full gap-4 mt-24">
        <h1 className="font-semibold text-6xl text-center w-full">
          A fictional marketplace to sell and buy, built with everything new in
          Next.js.
        </h1>
        <p className="text-lg font-medium text-center text-gray-500">
          Explore any items from independent brands around the world with ease.
        </p>
        <div className="flex justify-center gap-2">
          <Link className={buttonVariants()} href="/products">
            Buy now
          </Link>
          <Link
            className={buttonVariants({ variant: "outline" })}
            href="/products"
          >
            Sell now
          </Link>
        </div>
      </section>
      <CategoriesShowcase />
      <div className="flex flex-col w-full mt-36 items-center gap-2">
        <h1 className="text-4xl font-bold">Featured stores</h1>
        <p className="font-medium text-center text-gray-500">
          Shop hunders of products from these featured store for this week.
        </p>
        <div className="grid grid-cols-4 w-full gap-2">
          {featuredStore.map((store) => {
            return <FeaturedStoreCard store={store} key={store.id} />;
          })}
        </div>
        <Link
          href="/stores"
          className={buttonVariants({ variant: "outline", class: "mt-4" })}
        >
          View all stores
        </Link>
      </div>
    </div>
  );
}
