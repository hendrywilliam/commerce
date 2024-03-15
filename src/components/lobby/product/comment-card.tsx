import { Comment } from "@/db/schema";

interface CommentCardProps {
  comment: Comment;
}

export default function CommentCard({ comment }: CommentCardProps) {
  return (
    <div>
      <p className="text-gray-500">{comment.fullname}</p>
      <p>{comment.comment}</p>
    </div>
  );
}
