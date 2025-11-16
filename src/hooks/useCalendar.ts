import { useState } from "react";
import type { Card } from "../types/card";
import { checkAnswered } from "../apis/answer/answer.api";
import { isCardOpenableToday } from "../utils/date";
import { useNavigate } from "react-router-dom";

export const useCalendar = (navigate: Function) => {
  // 4x6 그리드용 24개 카드 
  const [ cards, setCards ] = useState<Card[]>(() => 
    Array.from({ length: 24}, (_, index) => ({
        id: index+1,
        image: "", // 각 우표 이미지를 stamp1, stamp2, ... , 로 다운받기
        isOpened: false,
        isExpired: false,
        isAnswered: false
    })));

  // 현재 클릭한 우표 
  const [ selectedCard, setSelectedCard ] = useState<Card | null>(null);
  
  // 우표 클릭 시 상태 변경 -> 편지지 슬라이딩 
  const handleCardClick = async (id: number) => {
    try {
      // checkAnswered API 호출 (카드 id를 questionId로 사용)
      const response = await checkAnswered(id);
      const isAnswered = response.answered || response; 
      
      {/* TODO 답변 완료된 경우 anwer-list로 라우팅 */ }
      if (isAnswered) {
      //   navigate(`/answer-list?questionId=${id}`);
        
      // } else {
        setCards(initialCards => {
          const updatedCards = initialCards.map(card => 
            card.id === id ? { ...card, isOpened : !card.isOpened} : card
          );
          // 클릭된 우표 저장
          const clickedCard = updatedCards.find((card) => card.id === id);
          if(clickedCard) {
            setSelectedCard(clickedCard);
          }
          return updatedCards;
        });
      }
    } catch (error) {
      console.error("답변 확인 중 오류가 발생했습니다: ", error);
      // 에러 발생 시 기본 동작 (LetterPage 렌더링)
      setCards(initialCards => {
        const updatedCards = initialCards.map(card => 
          card.id === id ? { ...card, isOpened : !card.isOpened} : card
        );
        // 클릭된 우표 저장
        const clickedCard = updatedCards.find((card) => card.id === id);
        if(clickedCard) {
          setSelectedCard(clickedCard);
        }
        return updatedCards;
      });
    }
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
