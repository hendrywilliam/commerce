import { db } from "@/db/core";
import Image from "next/image";
import Modal from "@/components/ui/modal";
import { redirect } from "next/navigation";
import type { UploadData } from "@/types";
import ImagePlaceholder from "@/components/image-placeholder";
import { parse_to_json, truncate, formatCurrency } from "@/lib/utils";

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

  const parsedImage = parse_to_json<UploadData[]>(
    productDetails?.image as string,
  )[0].url;

  return (
    <Modal>
      <div className="bg-background h-full w-full rounded mx-auto">
        <div className="flex h-full w-full">
          <div className="relative h-full w-1/2">
            {parsedImage ? (
              <Image
                src={parsedImage}
                fill
                alt={productDetails.name}
                className="object-cover rounded"
              />
            ) : (
              <ImagePlaceholder />
            )}
          </div>
          <div className="px-4 w-1/2 justify-between">
            <div className="space-y-4">
              <h1 className="font-bold text-2xl">
                {truncate(productDetails.name, 28)}
              </h1>
              <p className="font-medium">
                {formatCurrency(Number(productDetails.price))}
              </p>
              <p className="text-gray-500 leading-7 text-wrap">
                {productDetails?.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
