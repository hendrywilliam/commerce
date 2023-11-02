import { db } from "@/db/core";
import Modal from "@/components/ui/modal";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";

export default async function ProductModal({
  params: { productId },
}: {
  params: {
    productId: string;
  };
}) {
  const productDetails = await db.query.products.findFirst({
    where: (products, { eq }) => eq(products.id, Number(productId)),
  });

  const parsedImageUrl = JSON.parse(productDetails?.image as string)[0].fileUrl;
  return (
    <Modal>
      <div className="bg-background h-full lg:w-3/4 w-5/6 rounded mx-auto">
        <div className="flex flex-col h-full w-full gap-2">
          <div className="h-full w-full p-4">
            <div className="relative h-3/4 w-full">
              <Image
                src={parsedImageUrl}
                fill
                alt={productDetails?.name as string}
                className="object-contain rounded"
              />
            </div>
            <div className="py-4">
              <h1 className="font-semibold">
                {productDetails?.name} &#8212;{" "}
                <span>{formatCurrency(Number(productDetails?.price))}</span>
              </h1>
              <p>{productDetails?.description}</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
