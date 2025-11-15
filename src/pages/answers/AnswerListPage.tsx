import AnswerSlide from "./components/AnswerSlide";
import styled from "styled-components";
import Footer from "../../components/common/Footer";
import { useEffect, useState } from "react";
import Overlay from "../../components/common/Overlay/Overlay";
import { getAnswerList } from "../../apis/answer/answer.api";
import { useSearchParams } from "react-router-dom";

interface Answer {
  id: number;
  author: string;
  date: string;
  time: string;
  contents: string;
  likes: number;
  comments: number;
}

const AnswerListPage = () => {
  const [searchParams] = useSearchParams();
  const questionId = Number(searchParams.get('questionId')) || 1;
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true); 

  // 답변 리스트 불러오기 
  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const data = await getAnswerList(questionId);
        
        // 백엔드 응답 형식 변환
        const mappedData = data.map((response: any) => ({
          id: response.id,
          author: response.userName,
          date: response.createdTime.slice(0, 10),
          time: response.createdTime.slice(11, 16),
          contents: response.contents,
          likes: response.likeCount,
          comments: response.replyCount,
        }));

        setAnswers(mappedData);
      } catch(error) {
        console.error("답변 리스트를 불러오는 데 오류가 발생했습니다: ", error);
      }
    };
    fetchAnswers();
  }, [questionId]);

  // 더미데이터 
  // TODO: 답변 API 불러오기 
  const allAnswers: Answer[] = [
    { id: 1, author: "잘생긴 루돌프", date: "DEC 7", time: "18:44", contents: "아ㅓ알ㅇ러알아러아러아아ㅓ아ㅓㅏ랄ㅇ라얼ㅇ러알알ㅇㄹ아알ㅇ라이라이랑랑라리ㅏㄹㅏㄹ아알아러아ㅓ아러ㅏ러아러ㅏㅓㅇㄹ아ㅓㄹㅇ러ㅓㄹ러ㅏㅓㅇ라러ㅏㅓ라ㅓ러라러ㅏ러아ㅓ라러라ㅓ러ㅏㅓㅏ어라얼아러아렁렁라ㅏㅓ알댜ㅏ러야랑ㄹ아러아러아렁어ㅏㅓㄹ아ㅓ랑러앙ㄹ어러아라ㅓ러ㅏ어아ㅓㅏㅇㄹ알알라ㅏ알알", likes: 99, comments: 99 },
    { id: 2, author: "예쁜 산타", date: "DEC 7", time: "16:24", contents: "2번", likes: 99, comments: 99 },
    { id: 3, author: "건강한 개발자", date: "DEC 7", time: "12:28", contents: "3번", likes: 19, comments: 9 },
    { id: 4, author: "무례한 눈사람", date: "DEC 7", time: "11:59", contents: "4번", likes: 2, comments: 5 },
    { id: 5, author: "잘생긴 산타", date: "DEC 7", time: "13:00", contents: "5번", likes: 2, comments: 0 },
    { id: 6, author: "건강한 눈사람", date: "DEC 7", time: "14:30", contents: "6번", likes: 4, comments: 1 },
    { id: 7, author: "크리스마스", date: "DEC 7", time: "14:30", contents: "7번", likes: 3, comments: 1 },
   
  ];

  // 4개씩 묶어서 슬라이드 생성 (2x2 그리드)
  const chunkSize = 4;
  const answerChunks: Answer[][] = [];
  for (let i = 0; i < allAnswers.length; i += chunkSize) {
    answerChunks.push(allAnswers.slice(i, i + chunkSize));
  }

  // 배경 이미지 
  const slides = Array.from({length: answerChunks.length}, (_,i) => ({
    id: i+1,
    backgroundImg: new URL(`../../assets/images/background/bg${(i % 10) + 1}.png`, import.meta.url).href,
  }));

  const defaultBackground = new URL("../../assets/images/background/bg1.png", import.meta.url).href;
  const currentBackgroundImg =
    slides[currentSlide]?.backgroundImg || slides[0]?.backgroundImg || defaultBackground;
  const totalSlides = answerChunks.length;
  const canGoPrev = currentSlide > 0;
  const canGoNext = currentSlide < totalSlides - 1;

  const goToSlide = (index: number) => {
    if (index < 0 || index >= totalSlides) return;
    setCurrentSlide(index);
  };

  // TODO: 해당 우표의 질문 가져오기 (클릭한 우표 id로)
  const question = "올해 가장 기억에 남는 크리스마스 선물은 무엇인가요?";

  return (
    <PageWrapper backgroundImg={currentBackgroundImg}>
      <Overlay isVisible={true} bgColor={"rgba(0,0,0,0.6)"}/>
      <QuestionHeader>{question}</QuestionHeader>
      <SliderWrapper>
        {totalSlides > 0 && (
          <AnswerSlide answers={answerChunks[currentSlide]} />
        )}
        {totalSlides > 1 && (
          <SlideControls>
            <NavButton type="button" onClick={() => goToSlide(currentSlide - 1)} disabled={!canGoPrev}>
              이전
            </NavButton>
            <Dots>
              {slides.map((slide, index) => (
                <DotButton
                  key={slide.id}
                  type="button"
                  $active={currentSlide === index}
                  aria-label={`${index + 1}번째 슬라이드`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </Dots>
            <NavButton type="button" onClick={() => goToSlide(currentSlide + 1)} disabled={!canGoNext}>
              다음
            </NavButton>
          </SlideControls>
        )}
      </SliderWrapper>
      <Footer />
    </PageWrapper>

  )
}

export default AnswerListPage

const PageWrapper = styled.main<{backgroundImg: string}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: url(${({backgroundImg}) => backgroundImg}) no-repeat center;
  background-attachment: fixed;
`;

const QuestionHeader = styled.header`
  color: white;
  font-size: 24px;
  font-family: Gowun Batang;
  font-weight: 700;
  word-break: keep-all; /* 띄어쓰기 기준으로만 줄 바꿈 */
  padding: 0px 32px;
  margin-top: 70px;
  text-align: center;
  z-index:1;
`;

const SliderWrapper = styled.section`
  width: 100%;
  max-width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 0 16px 48px;
`;

const SlideControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const NavButton = styled.button`
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 999px;
  color: white;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    background: rgba(0, 0, 0, 0.6);
  }
`;

const Dots = styled.div`
  display: flex;
  gap: 8px;
`;

const DotButton = styled.button<{ $active: boolean }>`
  width: ${({ $active }) => ($active ? "12px" : "8px")};
  height: ${({ $active }) => ($active ? "12px" : "8px")};
  border-radius: 50%;
  border: none;
  background: ${({ $active }) => ($active ? "white" : "rgba(255, 255, 255, 0.4)")};
  cursor: pointer;
  transition: all 0.2s ease;
`;
