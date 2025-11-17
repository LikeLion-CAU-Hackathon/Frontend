import { useEffect, useState } from "react";
import type { Card } from "../types/card";
import { checkAnswered } from "../apis/answer/answer.api";
import { getTodayDate, isCardAfterToday, isCardBeforeToday, isCardOpenableToday } from "../utils/date";

export const useCalendar = (navigate: Function) => {
  const todayString = getTodayDate();
  const [year, month, day] = todayString.split("-").map(Number);
  const paddedMonth = String(month).padStart(2, "0");
  const createCardDate = (dayNumber: number) =>
    `${year}-${paddedMonth}-${String(dayNumber).padStart(2, "0")}`;

  const [cards, setCards] = useState<Card[]>(() =>
    Array.from({ length: 24 }, (_, index) => ({
      id: index + 1,
      date: createCardDate(index + 1),
      image: "", // 각 우표 이미지를 stamp1, stamp2, ... , 로 다운받기
      isOpened: false,
      isExpired: false,
      isAnswered: false,
    })));

  // 현재 클릭한 우표 
  const [ selectedCard, setSelectedCard ] = useState<Card | null>(null);

  // 각 우표의 answered 여부 초기에 확인
  useEffect(() => {
  const loadAnsweredStates = async () => {
    const updated = await Promise.all(
      cards.map(async (card) => {
        // 오늘 이후 날짜는 체크 안해도 됨
        if (isCardAfterToday(card.id)) {
          return { ...card, isAnswered: false };
        }
        try {
          const res = await checkAnswered(card.id);
          const answered =
            typeof res === "boolean"
              ? res
              : Boolean(res && res.answered);

          return { ...card, isAnswered: answered };
        } catch {
          return { ...card, isAnswered: false };
        }
      })
    );

    setCards(updated);
  };

  loadAnsweredStates();
}, []);


  // 우표 클릭 시 상태 변경 -> 편지지 슬라이딩 
  const handleCardClick = async (id: number) => {
    // 날짜 비교해서 다른 모달창 띄우기
    const card = cards.find( c => c.id === id);

    if (!card) return;

    if (isCardAfterToday(id)) {
      alert("오늘 날짜의 우표만 열 수 있어요!");
      return;
    }

    if (isCardBeforeToday(id)) {
      if(!card.isAnswered) {
        alert("답변 기한이 지났어요");
        return;
      }
      // before + 답변
      navigate(`/answer-list?questionId=${id}`);
      return;
    }

    if (isCardOpenableToday(id)) {
      if (card.isAnswered) {
        navigate(`/answer-list?questionId=${id}`);
        return;
      }
    }

      // 오늘 + 답변 미완료인 경우 편지지 열기 
        setCards(initialCards => {
          const updatedCards = initialCards.map(card => ({
            ...card,
            isOpened: card.id === id,
          }));
          const clickedCard = updatedCards.find((card) => card.id === id) ?? null;
          setSelectedCard(clickedCard);
          return updatedCards;
        }); 
        return;
    }

  // 우표 클릭된 순간 배경 overlay 추가
  const isCardOpened = cards.some(card => card.isOpened);

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
