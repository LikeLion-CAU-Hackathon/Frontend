import styled from "styled-components"
import LetterEnvelope from "../components/calendar/LetterEnvelope";


interface LetterEnvelopeProps {
  /** 편지봉투를 화면에 표시할지 여부 */
  isOpened?: boolean;
  question : string;
}

const LetterPage = ({ isOpened, question }: LetterEnvelopeProps) => {
  return (
    <LetterSection>
        <EnvelopeContainer $visible={isOpened}>
            <LetterEnvelope />
        </EnvelopeContainer>
        <LetterArticle isOpened={isOpened}>
            <QuestionHeader>
                <QuestionText>{question}</QuestionText>
            </QuestionHeader>
        </LetterArticle>
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

const LetterArticle = styled.article<{ isOpened?: boolean }>`
  width: 372.21px;
  height: 352.45px;
  background: #DECBA1;
  box-shadow: 0px 5px 12.476190567016602px rgba(104, 115, 130, 0.24);
  border-radius: 2.08px;
  z-index: 2;
  justify-content: center;
  display: flex;
  
  // 편지지 슬라이딩 효과 
  transform: ${({ isOpened }) => (isOpened ? "translateY(0)" : "translateY(120%)")};
  opacity: ${({ isOpened }) => (isOpened ? 1 : 0)};
  transition: transform 1.5s ease-in-out, opacity 0.6s ease-in-out;
`;

const QuestionHeader = styled.header``;

const QuestionText = styled.p`
`;