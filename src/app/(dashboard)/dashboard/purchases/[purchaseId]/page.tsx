import { db } from "@/db/core";
import { orders } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs";
import { ProductWithQuantity } from "@/types";
import { notFound, redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
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

  if (!purchase || typeof purchase === "undefined") {
    notFound();
  }

  let purchaseItems: ProductWithQuantity[];
  try {
    purchaseItems = parse_to_json<ProductWithQuantity[]>(
      purchase.items as string,
    );
  } catch (error) {
    purchaseItems = [];
  }

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
            {purchaseItems.length > 0 && (
              <div className="flex flex-col space-y-2">
                {purchaseItems.map((purchaseItem) => (
                  <div key={purchaseItem.id}>
                    <p>{purchaseItem.name}</p>
                  </div>
                ))}
              </div>
            )}
          </li>
        </ul>
        <PurchaseItemCommentForm />
      </section>
    </div>
  );
}
