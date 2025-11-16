// TODO: stamp 이미지 날짜별 나중에 추가 : stampImages.tsx 생성
import styled from 'styled-components'
import stampImage from '../../assets/images/stamp.svg'
import type { Card } from '../../types/card'
import { isCardAfterToday, isCardBeforeToday } from '../../utils/date'

interface CalendarCardProps {
    card: Card;
    onClick: (id: number ) => void;
}


const CalendarCard = ({ card, onClick }: CalendarCardProps) => {
  const isAfterToday = isCardAfterToday(card.id);
  const isBeforeToday = isCardBeforeToday(card.id);
  {/* TODO: 디자인 넘겨주면 각각 이미지 넣기  */}
  const showQuestionMark = isAfterToday;
  const showExpired = isBeforeToday;

  return (
    // 나중에 isOpened가 true일 때 편지지 열리게 추가 
    <CardSection onClick={() => onClick(card.id)}> 
        <CardImage src={stampImage} alt='stamp background' /> 
        {showQuestionMark && (
          <QuestionMark>?</QuestionMark>
        )}
        {showExpired && (
          <ExpiredLabel>Expired</ExpiredLabel>
        )}
    </CardSection> 
  )
}

export default CalendarCard

const CardSection = styled.section`
    margin: 0;
    position: relative;
`

const CardImage = styled.img`
  cursor: pointer;
`
// TODO: 카드 안에 넣는것으로 변경
const QuestionMark = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  color: black
  pointer-events: none;
`

const ExpiredLabel = styled.div`
  position: absolute;
  width: 64.76px;
  height: 19.07px;
  top: 40px;
  right:13px;
  padding: 2px;
  background: #A64848;
  justify-content: center;
  align-items: center;
  gap: 10px;
  display: inline-flex;
  z-index:0.5;
  color: white;
`