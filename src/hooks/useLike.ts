import { useState } from "react";
import { addLike, deleteLike } from "../apis/answer/like.api";

export const useLike = (initialLiked: boolean, initialCount: number, answerId: number) => {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialCount);

  const handleLike = async () => {
    try {
      let response;

      if (!liked) response = await addLike(answerId);
      else response = await deleteLike(answerId);

      setLiked(response.liked);
      setLikeCount(response.likeCount);

    } catch (error) {
      console.error("좋아요 실패", error);
    }
  };

  return { liked, likeCount, handleLike };
};