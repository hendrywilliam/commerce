import Link from "next/link";
import { db } from "@/db/core";
import { desc } from "drizzle-orm";
import { stores, products } from "@/db/schema";
import StoreCard from "@/components/lobby/store-card";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/ui/icons";
import ProductCard from "@/components/lobby/product-card";
import CategoriesShowcase from "@/components/lobby/categories-showcase";

export default async function IndexPage() {
  // const featuredStores = (await db.select().from(stores).limit(4)) as Omit<
  //   Store,
  //   "createdAt"
  // >[];

  const featuredStores = await db.select().from(stores).limit(4);

  const featuredProducts = await db
    .select()
    .from(products)
    .limit(10)
    .orderBy(desc(products.createdAt));
  // .where(gte(products.rating, 3))) as Omit<Product, "createdAt">[];

  return (
    <div className="container flex h-full w-full flex-col items-center p-4">
      <section className="mt-24 flex h-max w-full flex-col gap-4">
        <h1 className="w-full flex-wrap text-center text-4xl font-semibold lg:text-6xl">
          A fictional marketplace to sell and buy, built with everything new in
          Next.js.
        </h1>
        <p className="text-center text-lg font-medium text-gray-500">
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
      <div className="mt-36 flex w-full flex-col items-center gap-2">
        <div className="mb-4 inline-flex w-full justify-between">
          <div>
            <h1 className="text-4xl font-bold">Featured Products</h1>
            <p className="font-medium text-gray-500">
              Top 10 products for this week.
            </p>
          </div>
          <div>
            <Link
              href="/products"
              className={buttonVariants({
                class: "mt-4 inline-flex gap-2",
                variant: "outline",
              })}
            >
              View all products
              <ArrowRightIcon />
            </Link>
          </div>
        </div>
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          {featuredProducts.map((product) => {
            return <ProductCard product={product} key={product.id} />;
          })}
        </div>
      </div>
      <div className="mb-12 mt-36 flex w-full flex-col items-center gap-2">
        <div className="mb-4 inline-flex w-full justify-between">
          <div>
            <h1 className="text-4xl font-bold">Featured Stores</h1>
            <p className="text-center font-medium text-gray-500">
              Shop hundreds of products from these featured stores for this
              week.
            </p>
          </div>
          <div>
            <Link
              href="/stores"
              className={buttonVariants({
                class: "mt-4 inline-flex gap-2",
                variant: "outline",
              })}
            >
              View all stores
              <ArrowRightIcon />
            </Link>
          </div>
        </div>
        <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-4">
          {featuredStores.length > 0 &&
            featuredStores.map((store) => {
              return <StoreCard store={store} key={store.id} />;
            })}
        </div>
      </div>
    </div>
  );
}
