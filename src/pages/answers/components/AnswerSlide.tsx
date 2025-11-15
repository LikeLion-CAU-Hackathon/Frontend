import styled from "styled-components";
import AnswerGrid from "./AnswerGrid";

interface Answer {
    id: number;
    author: string;
    date: string;
    time: string;
    content: string;
    likes: number;
    comments: number;
}

interface AnswerSlideProps {
    backgroundImg: string;
    answers: Answer[];
}

const AnswerSlide = ({ backgroundImg, answers }: AnswerSlideProps ) => {
    return (
        <SlideWrapper backgroundImg={backgroundImg}>
            <AnswerGrid answers={answers} />
        </SlideWrapper>
    )
}

export default AnswerSlide;

const SlideWrapper = styled.section<{backgroundImg: string}>`
    padding: 20px 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
`;
