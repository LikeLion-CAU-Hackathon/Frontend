import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AnswerSlide from "./components/AnswerSlide";
import styled from "styled-components";
import Footer from "../../components/common/Footer";
import { useEffect, useMemo, useRef, useState } from "react";
import Overlay from "../../components/common/Overlay/Overlay";
import { getAnswerList } from "../../apis/answer/answer.api";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { getQuestion } from "../../apis/question/question.api";
import { convertIdToDate } from "../../utils/date";
import type { AnswerCardData } from "../../components/common/AnswerCard";
import closeIcon from "../../assets/images/Comments/x.svg";
import heartIcon from "../../assets/images/Comments/heart.svg";
import commentIcon from "../../assets/images/Comments/comment.svg";

type Answer = AnswerCardData & {
  liked?: boolean;
};

interface RelativeRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

type AnimationPhase = "start" | "end";

interface AnimationState {
  answer: Answer;
  phase: AnimationPhase;
  startRect: RelativeRect;
  targetRect: RelativeRect;
  backgroundImg: string;
}

const AnswerListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState<string>("");
  const [animationState, setAnimationState] = useState<AnimationState | null>(null);
  const pageWrapperRef = useRef<HTMLElement | null>(null);
  const animationTimeoutRef = useRef<number | null>(null);

  // URL params에서 cardId 가져오기
  const [searchParams] = useSearchParams();
  const cardId = searchParams.get("cardId") || searchParams.get("questionId");
  const previousSlideParam = (location.state as { previousSlide?: number } | null)?.previousSlide;

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
        const mappedData = answerData.map((response: any) => {
          // localStorage에서 좋아요 상태 확인
          const likedAnswers = JSON.parse(localStorage.getItem("likedAnswers") || "[]");
          const isLiked = likedAnswers.includes(response.answerId) || response.liked || false;
          
          return {
            id: response.answerId,
            author: response.userNickname,
            date: response.createdTime.slice(0, 10),
            time: response.createdTime.slice(11, 16),
            contents: response.contents,
            likes: response.likeCount,
            comments: response.replyCount,
            liked: isLiked,
          };
        });

        setAnswers(mappedData);
      } catch(error) {
        console.error("질문 또는 답변 리스트를 불러오는 데 오류가 발생했습니다: ", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuestionAndAnswers();
  }, [cardId]);

  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        window.clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof previousSlideParam === "number" && Number.isFinite(previousSlideParam)) {
      setCurrentSlide(previousSlideParam);
      navigate(".", { replace: true, state: null });
    }
  }, [navigate, previousSlideParam]);

  useEffect(() => {
    if (!animationState || animationState.phase !== "end") return;

    if (animationTimeoutRef.current) {
      window.clearTimeout(animationTimeoutRef.current);
    }

    animationTimeoutRef.current = window.setTimeout(() => {
      navigate("/comments", {
        state: {
          answer: animationState.answer,
          questionTitle: question,
          backgroundImg: animationState.backgroundImg,
          previousSlide: currentSlide,
          cardId,
        },
      });
      setAnimationState(null);
    }, 650);
  }, [animationState, cardId, currentSlide, navigate, question]);

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

  const answerChunks = useMemo(() => {
    const chunkSize = 4;
    const chunks: Answer[][] = [];
    for (let i = 0; i < answers.length; i += chunkSize) {
      chunks.push(answers.slice(i, i + chunkSize));
    }
    return chunks;
  }, [answers]);

  useEffect(() => {
    if (currentSlide > answerChunks.length - 1) {
      setCurrentSlide(Math.max(0, answerChunks.length - 1));
    }
  }, [answerChunks.length, currentSlide]);

  const slides = useMemo(
    () =>
      Array.from({ length: answerChunks.length }, (_, i) => ({
        id: i + 1,
        backgroundImg: new URL(`../../assets/images/background/bg${(i % 10) + 1}.png`, import.meta.url).href,
      })),
    [answerChunks.length]
  );

  const defaultBackground = new URL("../../assets/images/background/bg1.png", import.meta.url).href;
  const currentBackgroundImg =
    slides[currentSlide]?.backgroundImg || slides[0]?.backgroundImg || defaultBackground;

  const handleAnswerSelect = (answer: Answer, rect: DOMRect) => {
    const selectedBackground = currentBackgroundImg;
    const pageRect = pageWrapperRef.current?.getBoundingClientRect();
    if (!pageRect) {
      navigate("/comments", {
        state: {
          answer,
          questionTitle: question,
          backgroundImg: selectedBackground,
          previousSlide: currentSlide,
          cardId,
        },
      });
      return;
    }

    const relativeStart: RelativeRect = {
      top: rect.top - pageRect.top,
      left: rect.left - pageRect.left,
      width: rect.width,
      height: rect.height,
    };

    const targetWidth = Math.min(280, pageRect.width * 0.9);
    const targetHeight = Math.min(pageRect.height * 0.35, 360);
    const targetLeft = (pageRect.width - targetWidth) / 2;
    const targetTop = Math.max(20, pageRect.height * 0.08);

    const nextState: AnimationState = {
      answer,
      phase: "start",
      startRect: relativeStart,
      targetRect: {
        top: targetTop,
        left: targetLeft,
        width: targetWidth,
        height: targetHeight,
      },
      backgroundImg: selectedBackground,
    };

    setAnimationState(nextState);

    window.requestAnimationFrame(() => {
      setAnimationState((prev) => (prev ? { ...prev, phase: "end" } : prev));
    });
  };

  const overlayStyle =
    animationState?.phase === "start"
      ? animationState.startRect
      : animationState?.targetRect;

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

  const bgList = useMemo(() => slides.map(slide => slide.backgroundImg), [slides]);


  if (loading) {
    return (
      <PageWrapper>
        <BackgroundStrip index={currentSlide} bgList={bgList}>
          {bgList.map((src) => (
            <BackgroundItem key={src} src={src} />
          ))}
        </BackgroundStrip>
        <Overlay isVisible={true} bgColor={"rgba(0,0,0,0.6)"} disablePointerEvents />
        <QuestionHeader>로딩 중...</QuestionHeader>
        <Footer />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <BackgroundStrip index={currentSlide} bgList={bgList}>
        {bgList.map((src) => (
          <BackgroundItem key={src} src={src} />
        ))}
      </BackgroundStrip>
      <Overlay isVisible={true} bgColor={"rgba(0,0,0,0.6)"} disablePointerEvents />
      <QuestionHeader>{question}</QuestionHeader>
      <SliderWrapper $disabled={Boolean(animationState)}>
        <Slider {...settings}>
          {slides.map((slide, index) => (
            <AnswerSlide
              key={slide.id}
              answers={answerChunks[index] || []}
              onAnswerSelect={handleAnswerSelect}
            />
          ))}
        </Slider>
      </SliderWrapper>
      <Footer />

      {animationState && overlayStyle && (
        <>
          <AnimatedBackdrop />
          <AnimatedFadePanel $phase={animationState.phase} />
          <AnimatedCardOverlay
            $phase={animationState.phase}
            style={{
              top: overlayStyle.top,
              left: overlayStyle.left,
              width: overlayStyle.width,
              height: overlayStyle.height,
            }}
          >
            <AnimatedCardBody $phase={animationState.phase}>
              <AnimatedCardHeader>
                <AnimatedHeaderLeft>
                  <AnimatedInfo>
                    <AnimatedLabel>From.</AnimatedLabel>
                    <AnimatedValue>{animationState.answer.author}</AnimatedValue>
                  </AnimatedInfo>
                  <AnimatedInfo>
                    <AnimatedLabel>Date:</AnimatedLabel>
                    <AnimatedValue>
                      {animationState.answer.date} | {animationState.answer.time}
                    </AnimatedValue>
                  </AnimatedInfo>
                </AnimatedHeaderLeft>
                <AnimatedCloseButton aria-hidden="true">
                  <img src={closeIcon} alt="" />
                </AnimatedCloseButton>
              </AnimatedCardHeader>
              <AnimatedDivider />
              <AnimatedContent>{animationState.answer.contents}</AnimatedContent>
              <AnimatedFooter>
                <AnimatedStat>
                  <img src={heartIcon} alt="" />
                  {animationState.answer.likes}
                </AnimatedStat>
                <AnimatedStat>
                  <img src={commentIcon} alt="" />
                  {animationState.answer.comments}
                </AnimatedStat>
              </AnimatedFooter>
            </AnimatedCardBody>
          </AnimatedCardOverlay>
        </>
      )}
    </PageWrapper>
  );
}

export default AnswerListPage;

const PageWrapper = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  overflow: hidden;
  color: #000;
`;

const BackgroundStrip = styled.div<{ index: number; bgList: string[] }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  
  /* 슬라이드 개수만큼 가로로 길게 */
  width: ${({ bgList }) => `${bgList.length * 100}vw`};

  display: flex;
  transition: transform 0.6s ease-in-out;

  transform: translateX(${({ index }) => `-${index * 100}vw`});
`;

const BackgroundItem = styled.div<{ src: string }>`
  flex: 0 0 100vw;
  height: 100%;
  background-image: url(${({ src }) => src});
  background-repeat: repeat;
`;


const QuestionHeader = styled.header`
  color: white;
  font-size: 24px;
  font-family: Gowun Batang;
  font-weight: 700;
  word-break: keep-all;
  padding: 0px 32px;
  margin-top: 70px;
  text-align: center;
  position: relative;
  z-index: 1;
`;

const SliderWrapper = styled.section<{ $disabled?: boolean }>`
  width: 100%;
  max-width: 100vw;
  z-index: 2;
  pointer-events: ${({ $disabled }) => ($disabled ? "none" : "auto")};

  .slick-dots li button:before {
    color: rgba(255, 255, 255, 0.5);
    font-size: 10px;
  }

  .slick-dots li.slick-active button:before {
    color: white;
    font-size: 14px;
  }
`;

const AnimatedBackdrop = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 10;
`;

const AnimatedFadePanel = styled.div<{ $phase: AnimationPhase }>`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: min(480px, 95vw);
  height: clamp(36vh, 45%, 420px);
  background: #f8f4e8;
  box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.08);
  opacity: ${({ $phase }) => ($phase === "end" ? 1 : 0)};
  transition: opacity 0.2s ease;
  z-index: 10;
  pointer-events: none;
`;

const AnimatedCardOverlay = styled.div<{ $phase: AnimationPhase }>`
  position: absolute;
  z-index: 11;
  background: ${({ $phase }) => ($phase === "end" ? "#f0d6aa" : "#decba1")};
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
  transition:
    top 0.6s ease,
    left 0.6s ease,
    width 0.6s ease,
    height 0.6s ease,
    background 0.6s ease;
  overflow: hidden;
  pointer-events: none;
`;

const AnimatedCardBody = styled.div<{ $phase: AnimationPhase }>`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  opacity: ${({ $phase }) => ($phase === "end" ? 1 : 0)};
  transition: opacity 0.2s ease;
`;

const AnimatedCardHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  font-family: 'MaruBuri', 'Times New Roman', 'Georgia', serif;
`;

const AnimatedHeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const AnimatedInfo = styled.p`
  margin: 0;
  font-size: 14px;
  color: #5c3a1b;
  display: flex;
  gap: 6px;
  font-family: 'MaruBuri', 'Times New Roman', 'Georgia', serif;
`;

const AnimatedCloseButton = styled.div`
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 24px;
    height: 24px;
  }
`;

const AnimatedLabel = styled.span`
  font-weight: 700;
  color: #a3722b;
`;

const AnimatedValue = styled.span`
  font-weight: 400;
`;

const AnimatedDivider = styled.div`
  width: 100%;
  height: 1px;
  background: rgba(163, 114, 43, 0.5);
`;

const AnimatedContent = styled.p`
  flex: 1;
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
  color: #2c120b;
  overflow-y: auto;
  font-family: 'MaruBuri', 'Times New Roman', 'Georgia', serif;
`;

const AnimatedFooter = styled.footer`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  font-family: 'MaruBuri', 'Times New Roman', 'Georgia', serif;
`;

const AnimatedStat = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #2c120b;

  img {
    width: 18px;
    height: 18px;
  }
`;
