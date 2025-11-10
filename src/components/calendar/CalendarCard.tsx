import styled from 'styled-components'
import stampImage from '../../assets/images/stamp.svg'
import type { Card } from '../../types/card'

interface CalendarCardProps {
    card: Card;
    onClick: () => void;
}

const CalendarCard = ({ card, onClick }: CalendarCardProps) => {
  return (
    // 나중에 isOpened가 true일 때 편지지 열리게 추가 
    <CardSection onClick={onClick} $isOpened={card.isOpened}> 
        <CardImage src={stampImage} alt='stamp background' /> 
    </CardSection> 
  )
}

export default CalendarCard

const CardSection = styled.section<{ $isOpened: boolean }>`
    margin: 0;
    max-width: 100%;
    max-height: 100%;
`

const CardImage = styled.img`

`