import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AnswerSlide from "./components/AnswerSlide";
import styled from "styled-components";
import Footer from "../../components/common/Footer";
import { useEffect, useState } from "react";
import Overlay from "../../components/common/Overlay/Overlay";
import { getAnswerList } from "../../apis/answer/answer.api";
import { useSearchParams } from "react-router-dom";
import { getQuestion } from "../../apis/question/question.api";
import { convertIdToDate } from "../../utils/date";

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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState<string>("");

  // URL params에서 cardId 가져오기
  const [searchParams] = useSearchParams();
  const cardId = searchParams.get("cardId") || searchParams.get("questionId");

  // cardId로 질문과 답변 리스트 불러오기
  useEffect(() => {
    if (!cardId) {
      console.error("cardId가 없습니다.");
      setLoading(false);
      return;
    }

    const fetchQuestionAndAnswers = async () => {
      try {
        setLoading(true);
        const cardIdNumber = Number(cardId);
        
        // card.id를 날짜로 변환
        const date = convertIdToDate(cardIdNumber);
        const questionResponse = await getQuestion(date);
        console.log("해당 id의 질문:", questionResponse);
        
        // 질문 저장
        setQuestion(questionResponse.content || "");

        // cardId로 답변 리스트 불러오기
        const answerData = await getAnswerList(cardIdNumber);
        console.log("답변 리스트:", answerData);
        
        // 백엔드 응답 형식 변환
        const mappedData = answerData.map((response: any) => ({
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
        console.error("질문 또는 답변 리스트를 불러오는 데 오류가 발생했습니다: ", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuestionAndAnswers();
  }, [cardId]);

  // 더미데이터 
  // TODO: 답변 API 불러오기 
  // const allAnswers: Answer[] = [
  //   { id: 1, author: "잘생긴 루돌프", date: "DEC 7", time: "18:44", contents: "아ㅓ알ㅇ러알아러아러아아ㅓ아ㅓㅏ랄ㅇ라얼ㅇ러알알ㅇㄹ아알ㅇ라이라이랑랑라리ㅏㄹㅏㄹ아알아러아ㅓ아러ㅏ러아러ㅏㅓㅇㄹ아ㅓㄹㅇ러ㅓㄹ러ㅏㅓㅇ라러ㅏㅓ라ㅓ러라러ㅏ러아ㅓ라러라ㅓ러ㅏㅓㅏ어라얼아러아렁렁라ㅏㅓ알댜ㅏ러야랑ㄹ아러아러아렁어ㅏㅓㄹ아ㅓ랑러앙ㄹ어러아라ㅓ러ㅏ어아ㅓㅏㅇㄹ알알라ㅏ알알", likes: 99, comments: 99 },
  //   { id: 2, author: "예쁜 산타", date: "DEC 7", time: "16:24", contents: "2번", likes: 99, comments: 99 },
  //   { id: 3, author: "건강한 개발자", date: "DEC 7", time: "12:28", contents: "3번", likes: 19, comments: 9 },
  //   { id: 4, author: "무례한 눈사람", date: "DEC 7", time: "11:59", contents: "4번", likes: 2, comments: 5 },
  //   { id: 5, author: "잘생긴 산타", date: "DEC 7", time: "13:00", contents: "5번", likes: 2, comments: 0 },
  //   { id: 6, author: "건강한 눈사람", date: "DEC 7", time: "14:30", contents: "6번", likes: 4, comments: 1 },
  //   { id: 7, author: "크리스마스", date: "DEC 7", time: "14:30", contents: "7번", likes: 3, comments: 1 },
   
  // ];

  // 4개씩 묶어서 슬라이드 생성 (2x2 그리드)
  const chunkSize = 4;
  const answerChunks: Answer[][] = [];
  for (let i = 0; i < answers.length; i += chunkSize) {
    answerChunks.push(answers.slice(i, i + chunkSize));
  }

  // 배경 이미지 
  const slides = Array.from({length: answerChunks.length}, (_,i) => ({
    id: i+1,
    backgroundImg: new URL(`../../assets/images/background/bg${(i % 10) + 1}.png`, import.meta.url).href,
  }));

  const currentBackgroundImg = slides[currentSlide]?.backgroundImg || slides[0]?.backgroundImg;

  const settings = {
    dots: true,
    infinite: false,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (_current: number, next: number) => {
      setCurrentSlide(next);
    },
  }

  if (loading) {
    return (
      <PageWrapper backgroundImg={currentBackgroundImg}>
        <Overlay isVisible={true} bgColor={"rgba(0,0,0,0.6)"}/>
        <QuestionHeader>로딩 중...</QuestionHeader>
        <Footer />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper backgroundImg={currentBackgroundImg}>
      <Overlay isVisible={true} bgColor={"rgba(0,0,0,0.6)"}/>
      <QuestionHeader>{question}</QuestionHeader>
      <SliderWrapper>
        <Slider {...settings}>
          {slides.map((slide, index) => (
            <AnswerSlide 
              key={slide.id} 
              answers={answerChunks[index] || []}
            />
          ))}
        </Slider>
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

    li button:before {
      color: rgba(255, 255, 255, 0.5);
      font-size: 10px;
    }
    
    li.slick-active button:before {
      color: white;
      font-size: 14px;
    }
  }
`;