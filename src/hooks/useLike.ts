import { useEffect, useState } from "react";
import { addLike, deleteLike } from "../apis/answer/like.api";
import { toggleStoredLikedAnswer } from "../utils/likedAnswers";

export const useLike = (initialLiked: boolean, initialCount: number, answerId: number) => {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialCount);

  useEffect(() => {
    setLiked(initialLiked);
  }, [initialLiked]);

  useEffect(() => {
    setLikeCount(initialCount);
  }, [initialCount]);

  const handleLike = async () => {
    if (!answerId || answerId <= 0) {
      return;
    }

    try {
      let response;

      if (!liked) response = await addLike(answerId);
      else response = await deleteLike(answerId);

      const nextLiked = typeof response?.liked === "boolean" ? response.liked : !liked;
      const delta = nextLiked && !liked ? 1 : !nextLiked && liked ? -1 : 0;
      const nextCount =
        typeof response?.likeCount === "number" ? response.likeCount : likeCount + delta;

      setLiked(nextLiked);
      setLikeCount(Math.max(0, nextCount));
      toggleStoredLikedAnswer(answerId, nextLiked);
    } catch (error) {
      console.error("좋아요 실패", error);
    }
  };

  return { liked, likeCount, handleLike };
};
