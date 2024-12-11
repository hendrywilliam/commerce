import type { Comment } from "@/db/schema";
import { StarIcon } from "@/components/ui/icons";
import { Dispatch, SetStateAction } from "react";

interface RatingProps {
    isInteractable: boolean;
    comment?: Comment;
    rating?: number;
    setRating?: Dispatch<SetStateAction<number>>;
    totalRating?: number;
}

export default function Rating({
    isInteractable = false,
    rating,
    setRating,
    totalRating,
}: RatingProps) {
    return (
        <div className="flex items-center my-1">
            {isInteractable
                ? Array.from({ length: 5 }).map((_, index) =>
                      rating && index + 1 <= rating ? (
                          <StarIcon
                              className="hover:cursor-pointer"
                              key={index}
                              onClick={() => setRating && setRating(index + 1)}
                          />
                      ) : (
                          <StarIcon
                              key={index}
                              className="fill-gray-300 hover:cursor-pointer"
                              onClick={() => setRating && setRating(index + 1)}
                          />
                      )
                  )
                : Array.from({ length: 5 }).map((_, index) =>
                      rating && index + 1 <= rating ? (
                          <StarIcon key={index} />
                      ) : (
                          <StarIcon key={index} className="fill-gray-300" />
                      )
                  )}
            {totalRating && <p className="text-xs">({totalRating})</p>}
        </div>
    );
}
