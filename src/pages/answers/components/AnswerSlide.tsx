import styled from "styled-components";
import Footer from "../../../components/common/Footer";
import AnswerGrid from "./AnswerGrid";

interface AnswerSlideProps {
    backgroundImg: string;
}

const AnswerSlide = ({ backgroundImg }: AnswerSlideProps ) => {
    return (
        <SlideWrapper backgroundImg={backgroundImg}>
            <AnswerGrid />
            <Footer />
        </SlideWrapper>
    )
}

export default AnswerSlide;

const SlideWrapper = styled.section<{backgroundImg: string}>`
    background: url(${({backgroundImg}) => backgroundImg } no-repeat center/cover;);
`;
