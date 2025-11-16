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
  padding: 40px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
