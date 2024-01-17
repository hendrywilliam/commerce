import Link from "next/link";
import { db } from "@/db/core";
import type { Store } from "@/db/schema";
import { stores, products } from "@/db/schema";
import StoreCard from "@/components/lobby/store-card";
import { buttonVariants } from "@/components/ui/button";
import ProductCard from "@/components/lobby/product-card";
import CategoriesShowcase from "@/components/lobby/categories-showcase";

export default async function IndexPage() {
  const featuredStores = (await db.select().from(stores).limit(4)) as Omit<
    Store,
    "createdAt"
  >[];

  const featuredProducts = await db.select().from(products).limit(10);
  // .where(gte(products.rating, 3))) as Omit<Product, "createdAt">[];

  return (
    <div className="flex flex-col container h-full w-full items-center p-4">
      <section className="flex flex-col h-max w-full gap-4 mt-24">
        <h1 className="font-semibold text-4xl lg:text-6xl flex-wrap text-center w-full">
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
            href="/dashboard/stores"
          >
            Sell now
          </Link>
        </div>
      </section>
      <CategoriesShowcase />
      <div className="flex flex-col w-full mt-36 items-center gap-2">
        <h1 className="text-4xl font-bold">Featured Products</h1>
        <p className="font-medium text-center text-gray-500">
          Top 10 products for this week.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 w-full gap-4">
          {featuredProducts.map((product) => {
            return <ProductCard product={product} key={product.id} />;
          })}
        </div>
        <Link href="/products" className={buttonVariants({ class: "mt-4" })}>
          View all products
        </Link>
      </div>
      <div className="flex flex-col w-full mt-36 items-center gap-2">
        <h1 className="text-4xl font-bold">Featured Stores</h1>
        <p className="font-medium text-center text-gray-500">
          Shop hundreds of products from these featured stores for this week.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-4 w-full gap-4">
          {featuredStores.map((store) => {
            return <StoreCard store={store} key={store.id} />;
          })}
        </div>
        <Link href="/stores" className={buttonVariants({ class: "mt-4" })}>
          View all stores
        </Link>
      </div>
    </div>
  );
}
