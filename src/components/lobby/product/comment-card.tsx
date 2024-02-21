import { Comment } from "@/db/schema";
import { StarIcon } from "@/components/ui/icons";

interface CommentCardProps {
  comment: Comment;
}

export default function CommentCard({ comment }: CommentCardProps) {
  return (
    <div>
      <div className="inline-flex">
        {Array.from({ length: 5 }).map((_, index) =>
          index + 1 <= comment.rating ? (
            <StarIcon key={index} />
          ) : (
            <StarIcon key={index} className="fill-gray-400" />
          ),
        )}
      </div>
      <p className="text-gray-500">{comment.fullname}</p>
      <p>{comment.comment}</p>
    </div>
  );
}
