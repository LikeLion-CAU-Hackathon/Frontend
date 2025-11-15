import styled from 'styled-components'
import Footer from '../../components/common/Footer'
import LetterPage from './LetterPage';
import CardGrid from './components/CardGrid';
import { useNavigate } from 'react-router-dom';
import Overlay from '../../components/common/Overlay/Overlay';
import { useCalendar } from '../../hooks/useCalendar';

const CalendarPage = () => {
  const navigate = useNavigate();

  const {
    cards,
    selectedCard,
    isCardOpened,
    handleCardClick,
    handleCloseLetter,
  } = useCalendar(navigate);

  
  return (
    <PageContainer isOpened={isCardOpened} >
        {isCardOpened && <Overlay isVisible={isCardOpened} onClick={handleCloseLetter}/>}
        <MainContent>
            <CardGrid cards={cards} onCardClick={handleCardClick} />
        </MainContent>
        {/* isOpened=true인 경우 편지지 슬라이딩  */}
        {/* 클릭한 우표 편지지에 표시  */}
        <LetterPage card={selectedCard} isOpened={isCardOpened} />
        <Footer />
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
  position: relative;

`

const MainContent = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
`