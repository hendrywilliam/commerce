import { db } from "@/db/core";
import { currentUser } from "@clerk/nextjs";
import { eq, and, inArray } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Product, comments, orders } from "@/db/schema";
import { beautifyId, parse_to_json } from "@/lib/utils";
import PurchaseItemCommentForm from "@/components/dashboard/purchases/purchase-item-comment-form";

interface PurchaseDetailPageProps {
  params: { purchaseId: string };
}

export default async function PurchaseDetailPage({
  params,
}: PurchaseDetailPageProps) {
  const purchaseId = Number(params.purchaseId);

  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (isNaN(purchaseId)) {
    notFound();
  }

  const purchase = await db.query.orders.findFirst({
    where: and(eq(orders.id, purchaseId), eq(orders.userId, user.id)),
  });

  if (!purchase) {
    notFound();
  }

  // Refactor this disgusting code when you have time. Please?
  let purchaseItems: Product[];
  try {
    purchaseItems = parse_to_json<Product[]>(purchase.items as string);
  } catch (error) {
    purchaseItems = [];
  }

  const allComments =
    purchaseItems.length > 0 &&
    (await db
      .select()
      .from(comments)
      .where(
        and(
          eq(comments.orderId, purchase.id),
          inArray(comments.productId, [
            ...purchaseItems.map((purchaseItem) => purchaseItem.id),
          ]),
        ),
      ));

  let itemsWithComment =
    purchaseItems.length > 0
      ? purchaseItems.map((purchaseItem) => ({
          ...purchaseItem,
          comment:
            allComments && allComments.length > 0
              ? allComments.find(
                  (comment) => comment.productId === purchaseItem.id,
                )
              : undefined,
        }))
      : [];

  return (
    <div>
      <h1 className="font-bold text-2xl">Purchase Detail</h1>
      <p className="text-gray-500">
        Information about purchase history, you may leave a comment for each
        product.
      </p>
      <Separator />
      <section>
        <ul className="flex flex-col space-y-4">
          <li>
            <p className="text-gray-500">Purchase ID</p>
            <p>{purchase.id}</p>
          </li>
          <li>
            <p className="text-gray-500">Purchase Payment ID</p>
            <p>{beautifyId(purchase.stripePaymentIntentId as string)}</p>
          </li>
          <li>
            <p className="text-gray-500">Ordered Products</p>
            {itemsWithComment.length > 0 && (
              <div className="flex flex-col space-y-2">
                {itemsWithComment.map((item) => (
                  <div key={item.id} className="w-full lg:w-1/2">
                    <p>{item.name}</p>
                    <Separator />
                    {item.comment ? (
                      <PurchaseItemCommentForm
                        commentStatus="existing-comment"
                        comment={item.comment}
                      />
                    ) : (
                      <PurchaseItemCommentForm
                        commentStatus="new-comment"
                        orderId={purchase.id}
                        productId={item.id}
                        userId={user.id}
                        fullname={`
                        ${user.firstName ?? "Guest"} 
                        ${user.lastName ?? ""}
                        `}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </li>
        </ul>
      </section>
    </div>
  );
}
