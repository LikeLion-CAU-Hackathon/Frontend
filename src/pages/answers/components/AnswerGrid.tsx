import AnswerCard from '../../../components/common/AnswerCard';
import styled from 'styled-components';

interface AnswerGridProps {
    answers: {
        id: number;
        author: string;
        date: string;
        time: string;
        contents: string;
        likes: number;
        comments : number;
        liked?: boolean;
    }[];
}

const AnswerGrid = ( { answers }: AnswerGridProps ) => {
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