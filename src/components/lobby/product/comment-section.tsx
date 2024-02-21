import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { Product, comments } from "@/db/schema";
import CommentCard from "@/components/lobby/product/comment-card";

interface CommentSectionProps {
  productId: Product["id"];
}

export default async function ProductCommentSection({
  productId,
}: CommentSectionProps) {
  const allComments = await db
    .select()
    .from(comments)
    .where(eq(comments.productId, productId))
    .limit(10); // Limit 10 for now.

  return (
    <section className="flex flex-col space-y-4">
      {allComments.length > 0 &&
        allComments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
    </section>
  );
}
