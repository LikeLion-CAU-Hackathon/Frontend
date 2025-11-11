import styled from "styled-components"
import LetterEnvelope from "../components/calendar/LetterEnvelope";


interface LetterEnvelopeProps {
  /** 편지봉투를 화면에 표시할지 여부 */
  isOpened?: boolean;
  question : string;
}

const LetterPage = ({ isOpened, question }: LetterEnvelopeProps) => {
  if (!isOpened) return null;

  return (
    <LetterSection>
        <LetterEnvelope />
        <LetterArticle>
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
  justify-content: center;
`;

const LetterArticle = styled.article`
  width: 372.21px;
  height: 352.45px;
  background: #DECBA1;
  box-shadow: 0px 5px 12.476190567016602px rgba(104, 115, 130, 0.24);
  border-radius: 2.08px;
  z-index: 1;
`;

const QuestionHeader = styled.header``;

const QuestionText = styled.p`
`;