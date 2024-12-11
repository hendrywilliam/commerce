import { db } from "@/db/core";
import Image from "next/image";
import Modal from "@/components/ui/modal";
import { redirect } from "next/navigation";
import ImagePlaceholder from "@/components/image-placeholder";
import { truncate, formatCurrency } from "@/lib/utils";

export default async function ProductModal({
  params: { productSlug },
}: {
  params: {
    productSlug: string;
  };
}) {
  const productDetails = await db.query.products.findFirst({
    where: (products, { eq }) => eq(products.slug, productSlug),
  });

  if (!productDetails) {
    redirect("/");
  }

  return (
    <Modal>
      <div className="mx-auto h-full w-full rounded bg-background">
        <div className="flex h-full w-full">
          <div className="relative h-full w-1/2">
            {productDetails.image.length > 0 ? (
              <Image
                src={productDetails.image[0].url}
                fill
                alt={productDetails.name}
                className="rounded-l object-cover"
              />
            ) : (
              <ImagePlaceholder />
            )}
          </div>
          <div className="w-1/2 justify-between p-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">
                {truncate(productDetails.name, 28)}
              </h1>
              <p className="font-medium">
                {formatCurrency(Number(productDetails.price))}
              </p>
              <p className="text-gray-500">{productDetails.stock} in stock</p>
              <p className="text-wrap leading-7 text-gray-500">
                {productDetails?.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
