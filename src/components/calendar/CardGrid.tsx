import styled from "styled-components";
import type { Card } from "../../types/card";
import CalendarCard from "./CalendarCard";

const CardGrid = () => {
  // 4x6 그리드용 24개 카드 
  const cards: Card[] = Array.from({ length: 24 }, (_, index) => ({
    id: index + 1,
    image: '',
    isOpened: false,
  }));

  return (
    <GridContainer>
      {cards.map((card) => (
        <CalendarCard
          key={card.id}
          card={card}
          onClick={() =>{} }
        />
      ))}
    </GridContainer>
  )
}

export default CardGrid;

const GridContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
`

