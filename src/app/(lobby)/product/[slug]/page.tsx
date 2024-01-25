import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import type { UploadData } from "@/types";
import { notFound } from "next/navigation";
import { parse_to_json } from "@/lib/utils";
import { siteStaticMetadata } from "@/config/site";
import type { Metadata, ResolvingMetadata } from "next";
import { Product, Store, products, stores } from "@/db/schema";
import ProductPanel from "@/components/lobby/product/product-panel";
import ImageSelector from "@/components/lobby/product/image-selector";

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
  const { product, store } = (
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

  if (!product) {
    notFound();
  }

  const parsedImage = parse_to_json<UploadData[]>(product.image as string);

  return (
    <div className="flex flex-col container h-full w-full py-8">
      <div className="flex flex-col lg:flex-row h-[600px] w-full my-2 gap-8">
        <div className="group relative rounded h-full w-full overflow-hidden">
          <ImageSelector images={parsedImage} />
        </div>
        <div className="flex flex-col w-full gap-2">
          <h1 className="font-bold text-xl">{product.name}</h1>
          <p className="text-gray-500">{product.description}</p>
          <ProductPanel product={product} store={store} />
        </div>
      </div>
    </div>
  );
}
