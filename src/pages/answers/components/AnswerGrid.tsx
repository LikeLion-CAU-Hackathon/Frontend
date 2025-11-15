import AnswerCard from '../../../components/common/AnswerCard';
import styled from 'styled-components';

interface AnswerGridProps {
    answers: {
        id: number;
        author: string;
        date: string;
        time: string;
        content: string;
        likes: number;
        comments : number;
    }[];
}

const AnswerGrid = ( { answers }: AnswerGridProps ) => {
  return (
    <GridWrapper>
        {answers.map((answer) => (
            <AnswerCard
                key = {answer.id}
                author={answer.author}
                date={answer.date}
                time={answer.time}
                content={answer.content}
                likes={answer.likes}
                comments={answer.comments}
            />
        ))}
    </GridWrapper>
  )
}

export default AnswerGrid;

const GridWrapper = styled.section`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 16px;
  row-gap: 32px;
  width: 100%;
`;