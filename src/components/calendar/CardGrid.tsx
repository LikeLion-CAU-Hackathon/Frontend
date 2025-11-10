import styled from "styled-components";
import type { Card } from "../../types/card";
import CalendarCard from "./CalendarCard";

interface CardGridProps {
  cards: Card[];
  onCardClick: (id: number) => void;
}

const CardGrid = ( {cards, onCardClick} : CardGridProps) => {

  return (
    <GridContainer>
      {cards.map((card) => (
        <CalendarCard
          key={card.id}
          card={card}
          onClick={() => onCardClick(card.id) }
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

