import styled from 'styled-components'
import Footer from '../../components/common/Footer'
import { useState } from 'react';
import type { Card } from '../../types/card';
import LetterPage from './LetterPage';
import CardGrid from './components/CardGrid';

const CalendarPage = () => {
  // 4x6 그리드용 24개 카드 
  const [ cards, setCards ] = useState<Card[]>(() => 
    Array.from({ length: 24}, (_, index) => ({
        id: index+1,
        image: "", // 각 우표 이미지를 stamp1, stamp2, ... , 로 다운받기
        isOpened: false,
        isExpired: false,
        isAnswered: false
    })));

  // 우표 클릭 시 상태 변경 -> 편지지 슬라이딩 
  const handleCardClick = (id: number) => {
    setCards(initialCards => 
        initialCards.map(card => 
            card.id === id ? { ...card, isOpened : !card.isOpened} : card
        )
    )
  }

  // 우표 클릭된 순간 배경 overlay 추가
  const isCardOpened = cards.some(card => card.isOpened);

  {/* TODO: 어딜 클릭해도 편지지 사라지게 */}
  return (
    <PageContainer isOpened={isCardOpened} >
        {isCardOpened && <Overlay isVisible={isCardOpened} />}
        <MainContent>
            <CardGrid cards={cards} onCardClick={handleCardClick} />
        </MainContent>
        {/* isOpened=true인 경우 편지지 슬라이딩  */}
        <LetterPage isOpened={isCardOpened} />
        <Footer />
    </PageContainer>
  )
}

export default CalendarPage

const Overlay = styled.div<{ isVisible: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  transitions: opacity 0.3s ease-in-out; // 편지지 올라오는거랑 맞추기
  z-index: 1; 
`;

const PageContainer = styled.main<{isOpened : boolean}>`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;            
  justify-content: center;     
  gap: 25px;
  position: relative;

`

const MainContent = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
`