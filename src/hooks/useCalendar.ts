import { useEffect, useMemo, useState } from "react";
import type { Card } from "../types/card";
import { checkAnswered } from "../apis/answer/answer.api";
import { getTodayDate, isCardAfterToday, isCardBeforeToday, isCardOpenableToday, isOpportunityDay } from "../utils/date";

export const useCalendar = (navigate: Function) => {
  const todayString = getTodayDate();
  const [year, month, ] = todayString.split("-").map(Number);
  const paddedMonth = String(month).padStart(2, "0");

  const initialCards = useMemo(() => {
    const createCardDate = (dayNumber: number) =>
      `${year}-${paddedMonth}-${String(dayNumber).padStart(2, "0")}`;

    return Array.from({ length: 24 }, (_, index) => ({
      id: index + 1,
      date: createCardDate(index + 1),
      image: "", // 각 우표 이미지를 stamp1, stamp2, ... , 로 다운받기
      isOpened: false,
      isExpired: false,
      isAnswered: false,
    }));
  }, [paddedMonth, year]);

  const [cards, setCards] = useState<Card[]>(initialCards);

  useEffect(() => {
    setCards(initialCards);
  }, [initialCards]);

  // 현재 클릭한 우표 
  const [ selectedCard, setSelectedCard ] = useState<Card | null>(null);
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [isCalendarLoading, setIsCalendarLoading] = useState(true);

  const openNoticeModal = (message: string) => {
    setModalMessage(message);
  };

  const closeNoticeModal = () => {
    setModalMessage(null);
  };

  // 각 우표의 answered 여부 초기에 확인
  useEffect(() => {
    const loadAnsweredStates = async () => {
      setIsCalendarLoading(true);
      try {
        const updated = await Promise.all(
          initialCards.map(async (card) => {
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
      } finally {
        setIsCalendarLoading(false);
      }
    };

    loadAnsweredStates();
  }, [initialCards]);


  // 우표 클릭 시 상태 변경 -> 편지지 슬라이딩 
  const handleCardClick = async (id: number) => {
    // 날짜 비교해서 다른 모달창 띄우기
    const card = cards.find( c => c.id === id);

    if (!card) return;

    const isOpportunity = isOpportunityDay();

    if (isCardAfterToday(id)) {
      openNoticeModal("오늘 날짜의 우표만 열 수 있어요!");
      return;
    }

    if (isCardBeforeToday(id)) {
      // 12일이나 24일이면 답변하지 않은 카드도 열 수 있게 추가하기
      if(!card.isAnswered && !isOpportunity) {
        openNoticeModal("답변 기한이 지났어요. \n 12일이나 24일에 다시 답변할 수 있어요.");
        return;
      }
      // before + 답변 완료 또는 기회 제공일
      if (card.isAnswered) {
        navigate(`/answer-list?questionId=${id}`);
        return;
      }
      // 12/24일이고 답변하지 않은 경우 편지지 열기
      if (isOpportunity) {
        setCards(prevCards => {
          const updatedCards = prevCards.map(card => ({
            ...card,
            isOpened: card.id === id,
          }));
          const clickedCard = updatedCards.find((card) => card.id === id) ?? null;
          setSelectedCard(clickedCard);
          return updatedCards;
        }); 
        return;
      }
      return;
    }

    if (isCardOpenableToday(id)) {
      if (card.isAnswered) {
        navigate(`/answer-list?questionId=${id}`);
        return;
      }
    }

    // 오늘 + 답변 미완료인 경우 편지지 열기 
    setCards(prevCards => {
      const updatedCards = prevCards.map(card => ({
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

    // 캘린더로 가기 버튼 추가
  const handleGoBacktoCalendar = () => {
    navigate("/calendar", { replace: true})
  }


  return {
    cards,
    selectedCard,
    isCardOpened,
    handleCardClick,
    handleCloseLetter,
    modalMessage,
    closeNoticeModal,
    isCalendarLoading,
    handleGoBacktoCalendar
  };
};
