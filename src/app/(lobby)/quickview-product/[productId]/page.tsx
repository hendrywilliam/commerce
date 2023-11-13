import { db } from "@/db/core";
import { Product, products } from "@/db/schema";
import { slugify } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

interface QuickViewDynamicPage {
  params: {
    productId: string;
  };
}

export default async function QuickViewDynamicPage({
  params,
}: QuickViewDynamicPage) {
  const product = (await db.query.products.findFirst({
    where: eq(products.id, Number(params.productId)),
  })) as Product;

  redirect(`/product/${params.productId}/${slugify(product?.name as string)}`);
}
