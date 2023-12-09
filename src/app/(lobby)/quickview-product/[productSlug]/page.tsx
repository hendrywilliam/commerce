import { db } from "@/db/core";
import { Product, products } from "@/db/schema";
import { slugify } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

interface QuickViewDynamicPage {
  params: {
    productSlug: string;
  };
}

export default async function QuickViewDynamicPage({
  params,
}: QuickViewDynamicPage) {
  const product = (await db.query.products.findFirst({
    where: eq(products.slug, params.productSlug),
  })) as Product;

  redirect(`/product/${product.slug}`);
}
