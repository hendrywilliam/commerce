import { db } from "@/db/core";
import { products } from "@/db/schema";

export default async function ProductPage({
  params: { productId },
}: {
  params: {
    productId: string;
  };
}) {
  const productDetails = await db.query.products.findFirst({
    where: (products, { eq }) => eq(products.id, Number(productId)),
  });
  return (
    <div>
      <p>{productDetails?.name}</p>
    </div>
  );
}
