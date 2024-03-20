import { Separator } from "@/components/ui/separator";
import { beautifyId } from "@/lib/utils";
import PurchaseItemCommentForm from "@/components/dashboard/purchases/purchase-item-comment-form";
import { getSpecificPurchaseDetails } from "@/fetchers/purchase/get-specific-purchase-details";

interface PurchaseDetailPageProps {
  params: { purchaseId: string };
}

export default async function PurchaseDetailPage({
  params,
}: PurchaseDetailPageProps) {
  const purchaseId = Number(params.purchaseId);
  const { itemsWithComments, purchase } =
    await getSpecificPurchaseDetails(purchaseId);

  return (
    <div>
      <h1 className="text-2xl font-bold">Purchase Detail</h1>
      <p className="text-gray-500">
        Information about purchase history, you may leave a comment for each
        product.
      </p>
      <Separator />
      <section>
        <div className="flex flex-col space-y-4">
          <div>
            <p className="text-gray-500">Purchase ID</p>
            <p>{purchase.id}</p>
          </div>
          <div>
            <p className="text-gray-500">Purchase Payment ID</p>
            <p>{beautifyId(purchase.stripePaymentIntentId as string)}</p>
          </div>
          <div>
            <p className="text-gray-500">Ordered Products</p>
            {itemsWithComments.length > 0 && (
              <div className="flex flex-col space-y-2">
                {itemsWithComments.map((itemWithComment) => (
                  <div key={itemWithComment.id} className="w-full lg:w-1/2">
                    <p>{itemWithComment.name}</p>
                    <Separator />
                    {itemWithComment.comment ? (
                      <PurchaseItemCommentForm
                        commentStatus="existing-comment"
                        comment={itemWithComment.comment}
                      />
                    ) : (
                      <PurchaseItemCommentForm
                        commentStatus="new-comment"
                        orderId={purchase.id}
                        productId={itemWithComment.id}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
