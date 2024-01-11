import { db } from "@/db/core";
import Image from "next/image";
import Modal from "@/components/ui/modal";
import type { UploadData } from "@/types";
import { parse_to_json } from "@/lib/utils";
import ImagePlaceholder from "@/components/image-placeholder";

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

  const parsedImage = parse_to_json<UploadData[]>(
    productDetails?.image as string,
  )[0].url;

  return (
    <Modal>
      <div className="bg-background h-full w-full rounded mx-auto">
        <div className="h-full w-full">
          <div className="relative h-full w-full">
            {parsedImage ? (
              <Image
                src={parsedImage}
                fill
                alt={productDetails?.name as string}
                className="object-fill rounded"
              />
            ) : (
              <ImagePlaceholder />
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
