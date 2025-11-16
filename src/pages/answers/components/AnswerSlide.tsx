import styled from "styled-components";
import AnswerGrid from "./AnswerGrid";

interface Answer {
    id: number;
    author: string;
    date: string;
    time: string;
    contents: string;
    likes: number;
    comments: number;
    liked?: boolean;
}

interface AnswerSlideProps {
    answers: Answer[];
}

const AnswerSlide = ({  answers }: AnswerSlideProps ) => {
    return (
        <SlideWrapper>
            <AnswerGrid answers={answers} />
        </SlideWrapper>
    )
}

export default AnswerSlide;

const SlideWrapper = styled.section`
    padding: 40px 16px;
    display: flex;
    align-items: center;
    justify-content: center;
`;
