"use client";

import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useState } from "react";
import { Product, Store } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import ImagePlaceholder from "@/components/image-placeholder";
import { addItemToCart } from "@/actions/carts/add-item-to-cart";
import { catchError, formatCurrency, truncate } from "@/lib/utils";
import { IconCart, IconLoading, IconView } from "@/components/ui/icons";
import Rating from "@/components/rating";

type ProductCardProps = {
    product: Omit<Product, "createdAt">;
    store?: Store;
};

export default function ProductCard({ product, store }: ProductCardProps) {
    const [isLoading, setIsLoading] = useState(false);

    async function addToCart() {
        try {
            setIsLoading((isLoading) => !isLoading);
            toast.loading(
                `Adding ${product.name} to your cart. Please wait...`
            );
            const result = await addItemToCart({ id: product.id, qty: 1 });
            if (result?.error || !result.data) {
                throw new Error(result.error);
            }
            toast.success(`${result.data.name} has been added to your cart.`);
        } catch (error) {
            catchError(error);
        } finally {
            setIsLoading((isLoading) => !isLoading);
        }
    }

    return (
        <div className="relative h-max w-full">
            <div className="absolute right-2 top-2 z-[2] rounded bg-background px-2 py-1 font-semibold border border-primary text-primary">
                <p className="text-xs">{product.category}</p>
            </div>
            <Link href={`/${store?.slug}/${product.slug}`}>
                <div className="group relative h-56 overflow-hidden rounded">
                    {product.image[0].url ? (
                        <Image
                            src={product.image[0].url}
                            fill
                            sizes="100vw"
                            alt={product.name}
                            className="h-full w-full rounded-t object-cover transition duration-300 ease-in-out group-hover:scale-105"
                        />
                    ) : (
                        <ImagePlaceholder />
                    )}
                </div>
            </Link>
            <div className="mt-2">
                <div className="flex text-sm justify-between font-semibold">
                    <p>{truncate(product.name, 22)}</p>
                    <p>{formatCurrency(parseInt(product.price, 10))}</p>
                </div>
                <Rating
                    isInteractable={false}
                    rating={Math.floor(Number(product.averageRatings))}
                    totalRating={Number(product.averageRatings)}
                />
                <div className="mt-2 inline-flex w-full justify-between gap-2">
                    <Link
                        className={buttonVariants({
                            size: "sm",
                            variant: "outline",
                        })}
                        href={`/quickview-product/${product.slug}`}
                    >
                        <IconView />
                    </Link>
                    {product.stock > 0 ? (
                        <Button
                            onClick={addToCart}
                            size="sm"
                            className="inline-flex w-full gap-1"
                            disabled={isLoading}
                        >
                            {isLoading ? <IconLoading /> : <IconCart />}
                            Add to cart
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            className="inline-flex w-full gap-1"
                            disabled
                        >
                            Out of stock
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
