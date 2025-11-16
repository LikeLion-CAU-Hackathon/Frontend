import styled from "styled-components";
import letterBg from '../../assets/images/letter_background.png';
import { useEffect, useState } from "react";
import { convertIdToDate } from "../../utils/date";
import { formatDayToKorean } from "../../utils/dayToKorean";
import AnswerButton from "../common/button/AnswerButton";
import { useNavigate } from "react-router-dom";
import { getQuestion } from "../../apis/question/question.api";
import { useQuestionStore } from "../../store/questionStore";
import type { Card } from "../../types/card";

interface LetterContentProps {
    isOpened: boolean;
    card: Card | null;
    question?: string;
    date?: string | null;
    sequence?: number;
    isLoading?: boolean;
    error?: string | null;
    }

const LetterContent = ({
  isOpened,
  card,
//   question,
//   date,
//   sequence,
//   isLoading = false,
//   error = null,
}: LetterContentProps) => {
  
  const navigate = useNavigate();
  const [question, setQuestion] = useState<string>("");
  const setQuestionStore = useQuestionStore((state) => state.setQuestion);

  /* 편지지 제목에 들어갈 날짜 카드 ID로 변경 */
  const formatDay = card ? formatDayToKorean(card.id) : "";

//   const rawQuestion = question?.trim() ?? "";
//   let questionBody = rawQuestion;

    /* 해당 우표 id(=해당하는 날짜)에 해당하는 질문 불러오기 */
    useEffect(() => {
        if (!isOpened || !card) return;

        const fetchQ = async () => {
            const date = convertIdToDate(card.id);
            const response = await getQuestion(date); 
            setQuestion(response.content);
            console.log(response.content);

            // zustand에도 저장
            setQuestionStore({
                id: card.id,
                content: response.content,
                date: response.date,
            });
        }

        fetchQ();
        }, [isOpened, card]);

    return (
        <ArticleContainer isOpened={isOpened}>
            <QuestionSection>
                <QuestionHeader>{formatDay} 번째 질문:</QuestionHeader>
                <QuestionText>{question}</QuestionText>
            </QuestionSection>
            <ButtonSection>
                <AnswerButton width="135px" height="51px" fontSize="16px" borderRadius="12px" onClick={() => navigate("/answer")}/>
            </ButtonSection>
        </ArticleContainer>
    )
}

export default LetterContent;

const ArticleContainer = styled.article<{ isOpened?: boolean }>`
  width: 372.21px;
  height: 352.45px;
  background: #decba1 url(${letterBg}) no-repeat center;
  box-shadow: 0px 5px 12.476190567016602px rgba(104, 115, 130, 0.24);
  border-radius: 2.08px;
  z-index: 1;
  position: relative;
  pointer-events: auto;
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
  z-index: 10;
  position: relative;
  pointer-events: auto;
`;
