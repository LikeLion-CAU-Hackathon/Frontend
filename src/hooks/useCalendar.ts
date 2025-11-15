import { useState } from "react";
import type { Card } from "../types/card";
import { checkAnswered } from "../apis/answer/answer.api";
import { isCardOpenableToday } from "../utils/date";

export const useCalendar = (navigate: Function) => {
  // 4x6 그리드용 24개 카드
  const [cards, setCards] = useState<Card[]>(() =>
    Array.from({ length: 24 }, (_, index) => ({
      id: index + 1,
      image: "", // 각 우표 이미지를 stamp1, stamp2, ... , 로 다운받기
      isOpened: false,
      isExpired: false,
      isAnswered: false,
    }))
  );

  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  // 우표 클릭 시 상태 변경 -> 편지지 슬라이딩
  const handleCardClick = async (id: number) => {
    try {
    // 오늘 열리는 우표인지 확인 (오늘 기준 전과 후로 나누기)
      if (!isCardOpenableToday(id)) {
        alert("오늘의 우표가 아닙니다!");
        return;
      }

      const response = await checkAnswered(id);
      const isAnswered = response.answered;

      if (isAnswered) {
        navigate(`/answer-list?questionId=${id}`);
        return;
      }

      setCards((prev) =>
        prev.map((card) =>
          card.id === id ? { ...card, isOpened: !card.isOpened } : card
        )
      );

      // 클릭된 우표 저장
      const clickedCard = cards.find((card) => card.id === id);
      if (clickedCard) setSelectedCard(clickedCard);
    } catch (error) {
      console.error("답변 확인 중 오류가 발생했습니다:", error);
    }
  };

   // 우표 클릭된 순간 배경 overlay 추가
  const isCardOpened = cards.some((card) => card.isOpened);


  {/* TODO: 어딜 클릭해도 편지지 사라지게 */}
  const handleCloseLetter = () => {
    setCards((prev) => prev.map((card) => ({ ...card, isOpened: false })));
    setSelectedCard(null);
  };

  return {
    cards,
    selectedCard,
    isCardOpened,
    handleCardClick,
    handleCloseLetter,
  };
};
