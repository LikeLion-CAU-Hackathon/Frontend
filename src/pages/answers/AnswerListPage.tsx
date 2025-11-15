import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AnswerSlide from "./components/AnswerSlide";
import styled from "styled-components";
import Footer from "../../components/common/Footer";
import { useState } from "react";
import Overlay from "../../components/common/Overlay/Overlay";

interface Answer {
  id: number;
  author: string;
  date: string;
  time: string;
  content: string;
  likes: number;
  comments: number;
}

const AnswerListPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

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

  // TODO: 해당 우표의 질문 가져오기 (클릭한 우표 id로)
  const question = "올해 가장 기억에 남는 크리스마스 선물은 무엇인가요?";

  // 더미데이터 
  // TODO: 답변 API 불러오기 
  const allAnswers: Answer[] = [
    { id: 1, author: "잘생긴 루돌프", date: "DEC 7", time: "18:44", content: "아ㅓ알ㅇ러알아러아러아아ㅓ아ㅓㅏ랄ㅇ라얼ㅇ러알알ㅇㄹ아알ㅇ라이라이랑랑라리ㅏㄹㅏㄹ아알아러아ㅓ아러ㅏ러아러ㅏㅓㅇㄹ아ㅓㄹㅇ러ㅓㄹ러ㅏㅓㅇ라러ㅏㅓ라ㅓ러라러ㅏ러아ㅓ라러라ㅓ러ㅏㅓㅏ어라얼아러아렁렁라ㅏㅓ알댜ㅏ러야랑ㄹ아러아러아렁어ㅏㅓㄹ아ㅓ랑러앙ㄹ어러아라ㅓ러ㅏ어아ㅓㅏㅇㄹ알알라ㅏ알알", likes: 99, comments: 99 },
    { id: 2, author: "예쁜 산타", date: "DEC 7", time: "16:24", content: "2번", likes: 99, comments: 99 },
    { id: 3, author: "건강한 개발자", date: "DEC 7", time: "12:28", content: "3번", likes: 19, comments: 9 },
    { id: 4, author: "무례한 눈사람", date: "DEC 7", time: "11:59", content: "4번", likes: 2, comments: 5 },
    { id: 5, author: "잘생긴 산타", date: "DEC 7", time: "13:00", content: "5번", likes: 2, comments: 0 },
    { id: 6, author: "건강한 눈사람", date: "DEC 7", time: "14:30", content: "6번", likes: 4, comments: 1 },
    { id: 7, author: "크리스마스", date: "DEC 7", time: "14:30", content: "7번", likes: 3, comments: 1 },
    { id: 8, author: "멜크", date: "DEC 7", time: "14:30", content: "8번", likes: 2, comments: 1 },
   
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

  const currentBackgroundImg = slides[currentSlide]?.backgroundImg || slides[0]?.backgroundImg;

  return (
    <PageWrapper backgroundImg={currentBackgroundImg}>
      <Overlay isVisible={true} bgColor={"rgba(0,0,0,0.6)"}/>
      <QuestionHeader>{question}</QuestionHeader>
      <SliderWrapper>
        <Slider {...settings}>
          {slides.map((slide, index) => (
            <AnswerSlide 
              key={slide.id} 
              backgroundImg={slide.backgroundImg}
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
    }
  }
`;