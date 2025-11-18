import styled from "styled-components";
import letterBg from "../../assets/images/letter_background.png";
import { formatDayToKorean } from "../../utils/dayToKorean";
import AnswerButton from "../common/button/AnswerButton";

interface LetterContentProps {
  isOpened: boolean;
  question?: string;
  date?: string | null;
  sequence?: number;
  isLoading?: boolean;
  error?: string | null;
}

const LetterContent = ({
  isOpened,
  question,
  date,
  sequence,
  isLoading = false,
  error = null,
}: LetterContentProps) => {
  const headerLabel = sequence
    ? `${formatDayToKorean(sequence)} 번째 질문:`
    : "오늘의 질문:";


  const rawQuestion = question?.trim() ?? "";
  const displayQuestion = (() => {
    if (isLoading) return "질문을 불러오는 중입니다...";
    if (error) return error;
    if (rawQuestion.length > 0) return rawQuestion;
    return "오늘의 질문에 답변해주세요🦁!!!!";
  })();

  return (
      <ArticleContainer isOpened={isOpened}>
        <QuestionSection>
          <QuestionHeader>{headerLabel}</QuestionHeader>
          <QuestionText>{displayQuestion}</QuestionText>
        </QuestionSection>
        <ButtonSection isOpened={isOpened}>
            <AnswerButton
            width="135px"
            height="48px"
            fontSize="16px"
            borderRadius="12px"
            to="/answer"
            state={{
                questionId: sequence ?? null,
                questionText: rawQuestion,
                questionDate: date ?? null,
            }}
            />
        </ButtonSection>
    </ArticleContainer>
  );
};

export default LetterContent;

const ArticleContainer = styled.article<{ isOpened?: boolean }>`
  width: 372.21px;
  height: 352.45px;
  background: #decba1 url(${letterBg}) no-repeat center;
  color-scheme: light;
  box-shadow: 0px 5px 12.476190567016602px rgba(104, 115, 130, 0.24);
  border-radius: 2.08px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  font-family: "Gowun Batang", serif;
  padding: 34px 22px;
  gap: 15px;
  transform: ${({ isOpened }) =>
    isOpened ? "translateY(-15%)" : "translateY(120%)"};
  opacity: ${({ isOpened }) => (isOpened ? 1 : 0)};
  transition: transform 1.5s ease-in-out, opacity 0.6s ease-in-out;
  pointer-events: ${({ isOpened }) => (isOpened ? "auto" : "none")};
`;

const QuestionSection = styled.section`
  display: flex;
  flex-direction: column;
  color: #0b0202;
  font-size: 24px;
  word-wrap: break-word;
  text-align: center;
  align-items: center;
`;

const QuestionHeader = styled.header`
  font-weight: 400;
`;

const QuestionText = styled.h2`
  color: black;
  font-weight: 700;
  font-size: 20px;
  white-space: normal;
  word-break: keep-all;

`;

const ButtonSection = styled.section<{ isOpened?: boolean }>`
  cursor: pointer;
  text-align: center;
  align-items: center;
  z-index: 5;
  position: relative;
  pointer-events: ${({ isOpened }) => (isOpened ? "auto" : "none")};
`;

