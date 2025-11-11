import styled from 'styled-components'
import stampImage from '../../assets/images/stamp.svg'
import type { Card } from '../../types/card'

interface CalendarCardProps {
    card: Card;
    onClick: (id: number ) => void;
}


const CalendarCard = ({ card, onClick }: CalendarCardProps) => {

  return (
    // 나중에 isOpened가 true일 때 편지지 열리게 추가 
    <CardSection onClick={() => onClick(card.id)}> 
        <CardImage src={stampImage} alt='stamp background' /> 
    </CardSection> 
  )
}

export default CalendarCard

const CardSection = styled.section`
    margin: 0;
`

const CardImage = styled.img`
  cursor: pointer;
`