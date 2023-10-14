import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import CategoriesShowcase from "@/components/categories-showcase";
import FeaturedStoreCard from "@/components/cards/featured-store-card";
import FeaturedProductCard from "@/components/cards/featured-product-card";
import { stores, products } from "@/db/schema";
import type { Store, Product } from "@/db/schema";
import { db } from "@/db/core";
import { gte } from "drizzle-orm";

export default async function IndexPage() {
  const featuredStores = (await db.select().from(stores).limit(4)) as Omit<
    Store,
    "createdAt"
  >[];

  const featuredProducts = (await db
    .select()
    .from(products)
    .limit(8)
    .where(gte(products.rating, 3))) as Omit<Product, "createdAt">[];

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
        <h1 className="text-4xl font-bold">Featured products</h1>
        <p className="font-medium text-center text-gray-500">
          Top 8 products for this week.
        </p>
        <div className="grid grid-cols-4 w-full gap-2">
          {featuredProducts.map((product) => {
            return <FeaturedProductCard products={product} key={product.id} />;
          })}
        </div>
        <Link href="/stores" className={buttonVariants({ class: "mt-4" })}>
          View all products
        </Link>
      </div>
      <div className="flex flex-col w-full mt-36 items-center gap-2">
        <h1 className="text-4xl font-bold">Featured stores</h1>
        <p className="font-medium text-center text-gray-500">
          Shop hundreds of products from these featured store for this week.
        </p>
        <div className="grid grid-cols-4 w-full gap-2">
          {featuredStores.map((store) => {
            return <FeaturedStoreCard store={store} key={store.id} />;
          })}
        </div>
        <Link href="/stores" className={buttonVariants({ class: "mt-4" })}>
          View all stores
        </Link>
      </div>
    </div>
  );
}
