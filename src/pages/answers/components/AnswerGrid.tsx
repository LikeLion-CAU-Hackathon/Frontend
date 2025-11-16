import AnswerCard from "../../../components/common/AnswerCard";
import type { AnswerCardData } from "../../../components/common/AnswerCard";
import styled from "styled-components";

interface AnswerGridProps {
  answers: AnswerCardData[];
  onAnswerSelect?: (answer: AnswerCardData, rect: DOMRect) => void;
}

const AnswerGrid = ({ answers, onAnswerSelect }: AnswerGridProps) => {
  return (
    <GridWrapper>
        {answers.map((answer) => (
            <AnswerCard
                key={answer.id}
                id = {answer.id}
                author={answer.author}
                date={answer.date}
                time={answer.time}
                contents={answer.contents}
                likes={answer.likes}
                comments={answer.comments}
                liked={answer.liked}
                onSelect={onAnswerSelect}
            />
        ))}

    </GridWrapper>
  );
};

export default AnswerGrid;

const GridWrapper = styled.section`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 16px;
  row-gap: 32px;
  width: 100%;
`;
