import { useState, useEffect } from "react";
import type { Card } from "../types/card";
import { checkAnswered } from "../apis/answer/answer.api";
import { getTodayDate, isCardBeforeToday } from "../utils/date";

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
  
  // 오늘 날짜 가져오기
  const todayString = getTodayDate(); 
  const today = Number(todayString.split("-")[2]);  

  // 오늘 이전 카드들의 만료 상태 확인
  useEffect(() => {
    const updateExpiredCards = async () => {
      const expiredCardsPromises = cards
        .filter(card => isCardBeforeToday(card.id))
        .map(async (card) => {
          try {
            const response = await checkAnswered(card.id);
            const isAnswered = response.answered;
            // 오늘 이전이고 답변하지 않은 경우 만료 처리
            return {
              ...card,
              isExpired: !isAnswered,
              isAnswered: isAnswered
            };
          } catch (error) {
            console.error(`카드 ${card.id}의 상태 확인 중 오류:`, error);
            return card;
          }
        });

      const updatedExpiredCards = await Promise.all(expiredCardsPromises);
      
      setCards(prevCards => {
        const updatedCards = prevCards.map(card => {
          const updatedCard = updatedExpiredCards.find(c => c.id === card.id);
          return updatedCard || card;
        });
        return updatedCards;
      });
    };

    updateExpiredCards();
  }, []); 

  // 우표 클릭 시 상태 변경 -> 편지지 슬라이딩 
  const handleCardClick = async (id: number) => {

    if ( id > today ) {
        alert("오늘 날짜의 우표만 열 수 있어요!");
        // console.log("clicked id:", id);
        // console.log("today:", today);
        // console.log("is id > today ?", id > today);
        return;
    }
    
    // id <= today인 경우 
    try {
      // checkAnswered API 호출 
      const response = await checkAnswered(id);
    //   console.log(response);
      const isAnswered = response.answered; 

    // 날짜 비교해서 다른 모달창 띄우기
    if ( id < today ) {
      {/* TODO 답변 완료된 경우 anwer-list로 라우팅 */ }
      if (isAnswered) {
        navigate(`/answer-list?questionId=${id}`);
      } else {
        alert("답변 기한이 지났어요 😭") // TODO: 모달창으로 변경하기
      }
       return; 
    } 

    // id=today & 이미 답변한 상태
    if (isAnswered) {
      navigate(`/answer-list?questionId=${id}`);
      return;
    }
      // 답변 미완료인 경우 편지지 열기 
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
    } catch (error) {
      console.error("편지지 열기에서 오류가 발생했습니다.: ", error);

      // 에러 발생 시 일단 LetterPage 렌더링
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
