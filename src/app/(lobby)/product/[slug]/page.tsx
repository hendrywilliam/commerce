import { db } from "@/db/core";
import Image from "next/image";
import { eq } from "drizzle-orm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { UploadData } from "@/types";
import { notFound } from "next/navigation";
import { parse_to_json } from "@/lib/utils";
import { siteStaticMetadata } from "@/config/site";
import type { Metadata, ResolvingMetadata } from "next";
import ImagePlaceholder from "@/components/image-placeholder";
import { Product, Store, products, stores } from "@/db/schema";
import ProductPanel from "@/components/lobby/product/product-panel";

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
    title: `${productDetails?.name} — commerce` ?? "commerce by hendryw",
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

  const parsedImage = parse_to_json<UploadData[]>(product.image as string)[0]
    .url;

  return (
    <div className="flex flex-col container h-full w-full py-8">
      <div className="flex flex-col lg:flex-row h-full w-full my-2 gap-8">
        <div className="group relative rounded h-[600px] w-full overflow-hidden">
          {parsedImage ? (
            <Image
              src={parsedImage}
              fill
              alt={product.name ?? "Product Image"}
              className="w-full h-full object-fill rounded transition duration-300 ease-in-out group-hover:scale-105"
            />
          ) : (
            <ImagePlaceholder />
          )}
        </div>
        <div className="flex flex-col w-full gap-2">
          <h1 className="font-bold text-xl">{product.name}</h1>
          <ProductPanel product={product} store={store} />
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-gray-400">
                Product Description
              </AccordionTrigger>
              <AccordionContent>{product.description}</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
