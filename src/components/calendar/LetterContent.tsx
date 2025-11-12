import styled from "styled-components";
import letterBg from '../../assets/images/letter_background.png';
import { useEffect, useState } from "react";
import { getTodayDate } from "../../utils/date";
import { getQuestion } from "../../services/apis/questionAPI";
import { formatDayToKorean } from "../../utils/dayToKorean";

interface LetterContentProps {
    isOpened: boolean;
    }

const LetterContent = ({ isOpened } : LetterContentProps) => {
    const [question, setQuestion] = useState<string>("");

    const today = getTodayDate();

    /* 편지지 제목에 들어갈 날짜 한글로 포맷팅 */
    const day = Number(today.split('-')[2]);
    const formatDay = formatDayToKorean(day);

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
            {/* <AnswerButton>답변하기</AnswerButton> */}
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
  justify-content: center;
  display: flex;
  font-family: 'Gowun Batang', serif;

  // 편지지 슬라이딩 효과 
  transform: ${({ isOpened }) => (isOpened ? "translateY(0)" : "translateY(120%)")};
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
  margin-top: 34px;
`;

const QuestionText = styled.h2`
  color: black;
  font-weight: 700;
  font-size: 20px;
  padding: 0 20px;
`;