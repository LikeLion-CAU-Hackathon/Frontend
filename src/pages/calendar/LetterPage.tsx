import styled from "styled-components";
import LetterEnvelope from "./components/LetterEnvelope";
import LetterContent from "../../components/calendar/LetterContent";
import type { Card } from "../../types/card";

interface LetterPageProps {
  isOpened: boolean;
  card: Card | null;
  question: string;
  isLoading: boolean;
  error: string | null;
}

const LetterPage = ({ isOpened, card, question, isLoading, error }: LetterPageProps) => {
  return (
    <LetterSection>
      <EnvelopeContainer $visible={isOpened}>{card && <LetterEnvelope card={card} />}</EnvelopeContainer>
      <LetterContent
        isOpened={isOpened}
        question={question}
        date={card?.date}
        sequence={card?.id}
        isLoading={isLoading}
        error={error}
      />
    </LetterSection>
  );
};

export default LetterPage;

const LetterSection = styled.main`
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  z-index: 5;
  justify-content: center;
  align-items: center;
  pointer-events: none;
`;

const EnvelopeContainer = styled.div<{ $visible?: boolean }>`
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.6s ease-in-out 0.2s;
  pointer-events: none;
`;
