import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { Suspense } from "react";
import type { UploadData } from "@/types";
import { notFound } from "next/navigation";
import { parse_to_json } from "@/lib/utils";
import { StarIcon } from "@/components/ui/icons";
import { siteStaticMetadata } from "@/config/site";
import type { Metadata, ResolvingMetadata } from "next";
import { Product, Store, products, stores } from "@/db/schema";
import ProductPanel from "@/components/lobby/product/product-panel";
import ImageSelector from "@/components/lobby/product/image-selector";
import ProductCardSkeleton from "@/components/lobby/product-card-skeleton";
import ProductCommentSection from "@/components/lobby/product/comment-section";
import MoreStoreProducts from "@/components/lobby/product/more-store-products";
import Breadcrumbs from "@/components/breadcrumbs";

interface ProductPageProps {
  params: { slug: string };
}

export async function generateMetadata(
  { params }: ProductPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const productDetails = await db.query.products.findFirst({
    where: eq(products.slug, params.slug),
  });

  return {
    title: productDetails?.name
      ? `${productDetails?.name} — commerce`
      : "commerce by hendryw",
    description:
      productDetails?.description ??
      "A fictional marketplace built with everything new in Next.js 14",
    ...siteStaticMetadata,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const productAndStore = (
    await db
      .select({ product: products, store: stores })
      .from(products)
      .where(eq(products.slug, params.slug))
      .leftJoin(stores, eq(stores.id, products.storeId))
      .limit(1)
  )[0] as {
    product: Product;
    store: Store;
  };

  if (!productAndStore) {
    notFound();
  }

  const { product, store } = productAndStore;
  const parsedImage = parse_to_json<UploadData[]>(
    productAndStore.product.image as string,
  );

  return (
    <div className="container flex h-full w-full flex-col space-y-4 pb-8">
      <div className="my-2 flex h-[600px] w-full flex-col gap-8 lg:flex-row">
        <div className="group relative h-full w-full overflow-hidden rounded">
          <ImageSelector images={parsedImage} />
        </div>
        <div className="flex w-full flex-col gap-2">
          <h1 className="text-xl font-bold">{product.name}</h1>
          <div className="flex items-center gap-2">
            <StarIcon />
            <p>{product.averageRatings}</p>
          </div>
          <p className="text-gray-500">{product.description}</p>
          <ProductPanel product={product} store={store} />
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-bold">More products from {store.name}</h1>
        <Suspense
          fallback={
            <div className="mt-4 grid w-full gap-3 sm:grid-cols-4 lg:grid-cols-5">
              {Array.from({ length: 5 }).map((item, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          }
        >
          <MoreStoreProducts store={store} />
        </Suspense>
      </div>
      <div className="mt-4">
        <h1 className="mb-2 text-2xl font-bold">Comments</h1>
        <Suspense fallback={<p>...Loading</p>}>
          <ProductCommentSection productId={productAndStore.product.id} />
        </Suspense>
      </div>
    </div>
  );
}
