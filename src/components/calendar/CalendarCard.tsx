// TODO: stamp 이미지 날짜별 나중에 추가 : stampImages.tsx 생성
import styled from 'styled-components'
import stampImage from '../../assets/images/stamp.svg'
import type { Card } from '../../types/card'
import { stamps } from '../../utils/stampLoader';

interface CalendarCardProps {
    card: Card;
    onClick: (id: number ) => void;
}

const CalendarCard = ({ card, onClick }: CalendarCardProps) => {

  const answeredStamp = stamps[ (card.id - 1) % stamps.length];
  // console.log("stamps length:", stamps.length);
  // console.log("스탬프 이미지 확인:", answeredStamp);

  return (
    // 나중에 isOpened가 true일 때 편지지 열리게 추가 
    <CardSection onClick={() => onClick(card.id)}> 
        <CardImage src={stampImage} alt='stamp background' /> 

        { /* 답변이 완료된 경우(테스트용) : ! 지우기 */}
        {!card.isAnswered && (
        <Stamp src={answeredStamp} alt="answered-stamp" />
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

const Stamp = styled.img`
  position: absolute;
  width: 60px;
  z-index:1;
  top:10px;
  right:15px;
`