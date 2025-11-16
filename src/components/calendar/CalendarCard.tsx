// TODO: stamp 이미지 날짜별 나중에 추가 : stampImages.tsx 생성
import styled from 'styled-components'
import stampImage from '../../assets/images/stamp.svg'
import type { Card } from '../../types/card'
import { stamps } from '../../utils/stampLoader';
import { isCardAfterToday, isCardBeforeToday, isCardOpenableToday } from '../../utils/date';
import expiredStamp from '../../assets/images/stamp/expiredStamp.png'

interface CalendarCardProps {
    card: Card;
    onClick: (id: number ) => void;
}

const CalendarCard = ({ card, onClick }: CalendarCardProps) => {
  // 기본 
  const answeredStamp = stamps[ (card.id - 1) % stamps.length];

  let stampToShow: string | null = null;
  let opacity = 1;

  // TODO1: 오늘인데 답변 안했으면 opacity=0.9로
  if (isCardOpenableToday(card.id) && !card.isAnswered) {
    stampToShow = answeredStamp;
    opacity = 0.6

  } else if (isCardOpenableToday(card.id) && card.isAnswered){
    stampToShow = answeredStamp;

  // TODO2: 오늘 이전인데 답변 안했으면 "expired" 표시
  }   else if (isCardBeforeToday(card.id) && !card.isAnswered) {
    stampToShow = expiredStamp;

  // TODO3: 오늘 이전인데 답변 했으면 원래처럼 우표 표시 
  } else if (isCardBeforeToday(card.id) && card.isAnswered) {
    stampToShow = answeredStamp;
  }  else if (isCardAfterToday(card.id)) {
    stampToShow = null;
  }
 
  return (
    // 나중에 isOpened가 true일 때 편지지 열리게 추가 
    <CardSection onClick={() => onClick(card.id)}> 
        <CardImage src={stampImage} alt='stamp background' /> 
        { stampToShow && (
          <Stamp
             src={stampToShow}
             alt="stampImage"
             style={{opacity}}
            isExpired={stampToShow === expiredStamp}
          />
        )}

    </CardSection> 
  )
}

export default CalendarCard

const CardSection = styled.section`
    position: relative;
    margin: 0;
  
`

const CardImage = styled.img`
  cursor: pointer;
`

const Stamp = styled.img<{ isExpired?: boolean }>`
  position: absolute;
  width: 60px;
  z-index:1;
  top:10px;
  right:16px;

  ${({ isExpired }) =>
    isExpired &&
    `
    top: 45px;
    `}
`