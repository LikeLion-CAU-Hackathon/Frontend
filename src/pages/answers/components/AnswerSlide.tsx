import styled from "styled-components";
import AnswerGrid from "./AnswerGrid";
import type { AnswerCardData } from "../../../components/common/AnswerCard";

interface AnswerSlideProps {
  answers: AnswerCardData[];
  onAnswerSelect?: (answer: AnswerCardData, rect: DOMRect) => void;
}

const AnswerSlide = ({ answers, onAnswerSelect }: AnswerSlideProps) => {
  return (
    <SlideWrapper>
      <AnswerGrid answers={answers} onAnswerSelect={onAnswerSelect} />
    </SlideWrapper>
  );
};

export default AnswerSlide;

const SlideWrapper = styled.section`
  padding: 40px 16px 30px 16px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-height: 768px) {
    padding: 40px 16px 10px 16px;
  }

  @media (min-height: 800px) {
    padding: 40px 16px 100px 16px;
  }
`;