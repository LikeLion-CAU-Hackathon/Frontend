/* 우표 클릭시 편지봉투 열리는 페이지  */
import styled from "styled-components"
import LetterEnvelope from "./components/LetterEnvelope";
import LetterContent from "../../components/calendar/LetterContent";
import type { Card } from "../../types/card";

interface LetterEnvelopeProps {
  isOpened: boolean;
  card: Card | null;
}

const LetterPage = ({ isOpened, card }: LetterEnvelopeProps) => {

  return (
    <LetterSection>
        <EnvelopeContainer $visible={isOpened}>
            {card && <LetterEnvelope card={card} />}
        </EnvelopeContainer>
        <LetterContent isOpened={isOpened} card={card}/>
    </LetterSection>
  )
}

export default LetterPage

const LetterSection = styled.main`
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  z-index: 30;
 justify-content: center;
  align-items: center;
`;

const EnvelopeContainer = styled.div<{ $visible?: boolean }>`
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.6s ease-in-out 0.2s;
`;
