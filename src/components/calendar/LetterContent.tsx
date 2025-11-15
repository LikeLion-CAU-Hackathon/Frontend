import styled from "styled-components";
import letterBg from '../../assets/images/letter_background.png';
import { useEffect, useState } from "react";
import { getTodayDate } from "../../utils/date";
import { formatDayToKorean } from "../../utils/dayToKorean";
import AnswerButton from "../common/button/AnswerButton";
import { useNavigate } from "react-router-dom";
import { getQuestion } from "../../apis/question/question.api";

interface LetterContentProps {
    isOpened: boolean;
    }

const LetterContent = ({ isOpened } : LetterContentProps) => {
    const [question, setQuestion] = useState<string>("");

    const today = getTodayDate();

    /* 편지지 제목에 들어갈 날짜 한글로 포맷팅 */
    const day = Number(today.split('-')[2]);
    const formatDay = formatDayToKorean(day);

    const navigate = useNavigate();

    /* 오늘 날짜에 해당하는 질문 불러오기 */
    useEffect(() => {
        if (isOpened) {
            const fetchQuestion = async () => {
                try {
                    const response = await getQuestion(today);
                    setQuestion(response.question);
                } catch (error) {
                    console.error("질문을 불러오는데 실패했습니다.", error);
                }
            };
            fetchQuestion();
        }
    }, [isOpened]);

    return (
        <ArticleContainer isOpened={isOpened}>
            <QuestionSection>
                <QuestionHeader>{formatDay} 번째 질문:</QuestionHeader>
                <QuestionText>{question}테스트테스트테스트dfdfdsdsdsdssdssdssss</QuestionText>
            </QuestionSection>
            <ButtonSection>
                <AnswerButton width="135px" height="51px" fontSize="16px" borderRadius="12px" onClick={() => navigate("/answer")}/>
            </ButtonSection>
        </ArticleContainer>
    )
}

export default LetterContent

const ArticleContainer = styled.article<{ isOpened?: boolean }>`
  width: 372.21px;
  height: 352.45px;
  background: #DECBA1 url(${letterBg}) no-repeat center;
  box-shadow: 0px 5px 12.476190567016602px rgba(104, 115, 130, 0.24);
  border-radius: 2.08px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  font-family: 'Gowun Batang', serif;
  padding:34px;
  gap:15px;

  // 편지지 슬라이딩 효과 
  transform: ${({ isOpened }) => (isOpened ? "translateY(-15%)" : "translateY(120%)")};
  opacity: ${({ isOpened }) => (isOpened ? 1 : 0)};
  transition: transform 1.5s ease-in-out, opacity 0.6s ease-in-out;
`;

const QuestionSection = styled.section`
  display: flex;
  flex-direction: column;
  color: #0B0202;
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
  padding: 0 20px;
`;

const ButtonSection = styled.section`
  cursor: pointer;
  text-align: center;
  align-items: center;
`;