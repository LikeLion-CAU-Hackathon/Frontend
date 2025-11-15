import styled from "styled-components";
import letterBg from "../../assets/images/letter_background.png";
import { formatDayToKorean } from "../../utils/dayToKorean";
import AnswerButton from "../common/button/AnswerButton";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const headerLabel = sequence ? `${formatDayToKorean(sequence)} 번째 질문` : "오늘의 질문";
  const formattedDate = date
    ? new Date(date).toLocaleDateString("ko-KR", { month: "long", day: "numeric" })
    : "";

  const rawQuestion = question?.trim() ?? "";
  let questionBody = rawQuestion;

  if (isLoading) {
    questionBody = "질문을 불러오는 중입니다...";
  } else if (error) {
    questionBody = error;
  } else if (!questionBody) {
    questionBody = "오늘의 질문이 준비 중입니다.";
  }

  return (
    <ArticleContainer isOpened={isOpened}>
      <QuestionSection>
        <QuestionHeader>{headerLabel}</QuestionHeader>
        {formattedDate && <QuestionDate>{formattedDate}</QuestionDate>}
        <QuestionText>{questionBody}</QuestionText>
      </QuestionSection>
      <ButtonSection>
        <AnswerButton
          width="135px"
          height="51px"
          fontSize="16px"
          borderRadius="12px"
          disabled={!sequence || isLoading || !!error}
          onClick={() => {
            if (!sequence) return;
            navigate(`/answer-list?questionId=${sequence}`, {
              state: {
                questionId: sequence,
                questionText: rawQuestion,
                questionDate: date,
              },
            });
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
  box-shadow: 0px 5px 12.476190567016602px rgba(104, 115, 130, 0.24);
  border-radius: 2.08px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  font-family: "Gowun Batang", serif;
  padding: 34px;
  gap: 15px;
  transform: ${({ isOpened }) => (isOpened ? "translateY(-15%)" : "translateY(120%)")};
  opacity: ${({ isOpened }) => (isOpened ? 1 : 0)};
  transition: transform 1.5s ease-in-out, opacity 0.6s ease-in-out;
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

const QuestionDate = styled.p`
  margin: 4px 0 12px;
  font-size: 16px;
  color: #5c3a1b;
`;

const QuestionText = styled.h2`
  color: black;
  font-weight: 700;
  font-size: 20px;
  padding: 0 20px;
`;

const ButtonSection = styled.section`
  cursor: pointer;
  text-align: center;
  align-items: center;
`;
