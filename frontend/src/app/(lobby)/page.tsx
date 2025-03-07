import Link from "next/link";
import { Suspense } from "react";
import DiscoverProducts from "@/components/lobby/discover-products";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/ui/icons";
import ProductCardSkeleton from "@/components/lobby/product-card-skeleton";
import CategoriesShowcase from "@/components/lobby/categories-showcase";

export default async function IndexPage() {
    return (
        <div className="container flex h-full w-full flex-col items-center p-4">
            <section className="mt-24 flex h-max w-full flex-col gap-4">
                <h1 className="w-full flex-wrap text-center text-4xl font-semibold lg:text-6xl">
                    A fictional marketplace to sell and buy, built with
                    everything new in Next.js.
                </h1>
                <p className="text-center text-lg font-medium text-gray-500">
                    Explore any items from independent brands around the world
                    with ease.
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
            {/* <CategoriesShowcase /> */}
            <div className="mt-36 flex w-full flex-col items-center gap-2">
                <div className="mb-4 inline-flex w-full justify-between">
                    <div>
                        <h1 className="font-bold">Discover Products</h1>
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
                <Suspense
                    fallback={
                        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <ProductCardSkeleton key={i} />
                            ))}
                        </div>
                    }
                >
                    {/* <DiscoverProducts /> */}
                </Suspense>
            </div>
        </div>
    );
}
