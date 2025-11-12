import styled from "styled-components"
import LetterEnvelope from "../components/calendar/LetterEnvelope";
import LetterContent from "../components/calendar/LetterContent";

interface LetterEnvelopeProps {
  isOpened: boolean;
}

const LetterPage = ({ isOpened }: LetterEnvelopeProps) => {

  return (
    <LetterSection>
        <EnvelopeContainer $visible={isOpened}>
            <LetterEnvelope />
        </EnvelopeContainer>
        <LetterContent isOpened={isOpened}/>
    </LetterSection>
  )
}

export default LetterPage

const LetterSection = styled.section`
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
