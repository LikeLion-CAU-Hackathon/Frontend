import styled from 'styled-components'
import CardGrid from '../components/calendar/CardGrid'
import Footer from '../components/common/Footer'
import { useState } from 'react';
import type { Card } from '../types/card';

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

  return (
    <PageContainer isOpened={isCardOpened} >
      {/* isOpened=true인 경우 overlay 추가  */}
      {isCardOpened && <Overlay />}
        <MainContent>
            <CardGrid cards = {cards} onCardClick={handleCardClick} />
        </MainContent>
        <FooterSection>
            <Footer />
        </FooterSection>
    </PageContainer>
  )
}

export default CalendarPage

const PageContainer = styled.main<{isOpened : boolean}>`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;            
  justify-content: center;     
  gap: 25px;    
`
const Overlay = styled.div`
  position: absolute; 
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  z-index: 10;
`;

const MainContent = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
`

const FooterSection = styled.footer`
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
`
