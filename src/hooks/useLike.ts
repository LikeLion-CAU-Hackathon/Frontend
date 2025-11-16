import { useState, useEffect } from "react";
import { addLike, deleteLike } from "../apis/answer/like.api";

// user의 liked 정보 localStorage에 저장
const getLikedFromStorage = (answerId: number): boolean => {
  if (typeof window === "undefined") return false;
  const likedAnswers = JSON.parse(localStorage.getItem("likedAnswers") || "[]");
  return likedAnswers.includes(answerId);
};

const saveLikedToStorage = (answerId: number, liked: boolean) => {
  if (typeof window === "undefined") return;
  const likedAnswers = JSON.parse(localStorage.getItem("likedAnswers") || "[]");
  
  if (liked) {
    if (!likedAnswers.includes(answerId)) {
      likedAnswers.push(answerId);
    }
  } else {
    const index = likedAnswers.indexOf(answerId);
    if (index > -1) {
      likedAnswers.splice(index, 1);
    }
  }
  
  localStorage.setItem("likedAnswers", JSON.stringify(likedAnswers));
};

export const useLike = (initialLiked: boolean, initialCount: number, answerId: number) => {
  // localStorage에서 저장된 좋아요 상태 확인 
  const storedLiked = getLikedFromStorage(answerId);
  const [liked, setLiked] = useState(initialLiked || storedLiked);
  const [likeCount, setLikeCount] = useState(initialCount);

  // 초기에 localStorage에서 좋아요 상태 불러오기
  useEffect(() => {
    const stored = getLikedFromStorage(answerId);
    if (stored) {
      setLiked(true);
    }
  }, [answerId]);

  const handleLike = async () => {
    try {
      let response;

      if (!liked) response = await addLike(answerId);
      else response = await deleteLike(answerId);

      setLiked(response.liked);
      setLikeCount(response.likeCount);
      
      // localStorage에 좋아요 상태 저장
      saveLikedToStorage(answerId, response.liked);

    } catch (error) {
      console.error("좋아요 실패", error);
    }
  };

  return { liked, likeCount, handleLike };
};