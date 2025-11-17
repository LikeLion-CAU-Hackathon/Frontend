import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AnswerSlide from "./components/AnswerSlide";
import styled from "styled-components";
import Footer from "../../components/common/Footer";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Overlay from "../../components/common/Overlay/Overlay";
import { getAnswerList } from "../../apis/answer/answer.api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getQuestion } from "../../apis/question/question.api";
import { convertIdToDate } from "../../utils/date";
import type { AnswerCardData } from "../../components/common/AnswerCard";
import closeIcon from "../../assets/images/Comments/x.svg";
import heartIcon from "../../assets/images/Comments/heart.svg";
import commentIcon from "../../assets/images/Comments/comment.svg";

const ANSWER_LIST_STATE_KEY = "answerListState";

type StoredAnswerListState = {
  cardId?: string | null;
  slide?: number;
};

const readStoredAnswerListState = (): StoredAnswerListState | null => {
  try {
    const raw = sessionStorage.getItem(ANSWER_LIST_STATE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return parsed as StoredAnswerListState;
    }
  } catch (error) {
    console.warn("Failed to read stored answer list state", error);
  }
  return null;
};

const storeAnswerListState = (cardId: string | null, slide: number) => {
  try {
    sessionStorage.setItem(
      ANSWER_LIST_STATE_KEY,
      JSON.stringify({ cardId: cardId ?? null, slide })
    );
  } catch (error) {
    console.warn("Failed to store answer list state", error);
  }
};

const clearStoredAnswerListState = () => {
  try {
    sessionStorage.removeItem(ANSWER_LIST_STATE_KEY);
  } catch (error) {
    console.warn("Failed to clear stored answer list state", error);
  }
};

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

const shuffleArray = <T,>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const AnswerListPage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState<string>("");
  const [animationState, setAnimationState] = useState<AnimationState | null>(null);
  const pageWrapperRef = useRef<HTMLElement | null>(null);
  const animationTimeoutRef = useRef<number | null>(null);
  const sliderRef = useRef<Slider | null>(null);
  const sliderWrapperRef = useRef<HTMLDivElement | null>(null);
  const [backgroundOffset, setBackgroundOffset] = useState(() => -currentSlide * 100);
  const rafRef = useRef<number | null>(null);

  // URL params에서 cardId 가져오기
  const [searchParams, setSearchParams] = useSearchParams();
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
    const storedState = readStoredAnswerListState();
    if (!storedState) return;
    const targetSlide =
      typeof storedState.slide === "number" && Number.isFinite(storedState.slide)
        ? storedState.slide
        : null;
    const targetCardId =
      typeof storedState.cardId === "string" && storedState.cardId.length > 0
        ? storedState.cardId
        : null;

    if (targetCardId && targetCardId !== cardId) {
      setSearchParams({ cardId: targetCardId });
    }
    if (targetSlide !== null) {
      setCurrentSlide(Math.max(0, targetSlide));
    }
    clearStoredAnswerListState();
  }, [cardId, setSearchParams]);

  useEffect(() => {
    if (!animationState || animationState.phase !== "end") return;

    if (animationTimeoutRef.current) {
      window.clearTimeout(animationTimeoutRef.current);
    }

    animationTimeoutRef.current = window.setTimeout(() => {
      persistAnswerListState();
      navigate("/comments", {
        state: {
          answer: animationState.answer,
          questionTitle: question,
          backgroundImg: animationState.backgroundImg,
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

  // 슬라이더 위치 추적하여 배경 strip 동기화
  useEffect(() => {
    if (!sliderWrapperRef.current || answerChunks.length === 0) return;

    // 슬라이더가 초기화될 때까지 약간 대기
    const initTimeout = setTimeout(() => {
      const trackElement = sliderWrapperRef.current?.querySelector('.slick-track') as HTMLElement;
      if (!trackElement) {
        // track 요소가 아직 준비되지 않은 경우 초기 offset 설정
        setBackgroundOffset(-currentSlide * 100);
        return;
      }

      const updateBackgroundPosition = () => {
        if (!sliderWrapperRef.current) return;
        
        const track = sliderWrapperRef.current.querySelector('.slick-track') as HTMLElement;
        if (!track) return;

        const transform = window.getComputedStyle(track).transform;
        if (!transform || transform === 'none') {
          // transform이 없으면 currentSlide 기반으로 계산
          setBackgroundOffset(-currentSlide * 100);
          rafRef.current = requestAnimationFrame(updateBackgroundPosition);
          return;
        }

        // matrix 또는 matrix3d에서 translateX 값 추출
        const matrix = transform.match(/matrix(?:3d)?\(([^)]+)\)/);
        if (!matrix) {
          setBackgroundOffset(-currentSlide * 100);
          rafRef.current = requestAnimationFrame(updateBackgroundPosition);
          return;
        }

        const values = matrix[1].split(',').map(v => parseFloat(v.trim()));
        // matrix: [a, b, c, d, tx, ty]
        // matrix3d: [m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44]
        const translateX = values.length >= 6 ? values[4] : (values.length >= 16 ? values[12] : 0);

        // 슬라이더의 translateX를 vw 단위로 변환
        const sliderWidth = sliderWrapperRef.current.clientWidth || window.innerWidth;
        const offsetInVw = (translateX / sliderWidth) * 100;

        setBackgroundOffset(offsetInVw);

        rafRef.current = requestAnimationFrame(updateBackgroundPosition);
      };

      rafRef.current = requestAnimationFrame(updateBackgroundPosition);
    }, 100);

    return () => {
      clearTimeout(initTimeout);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [answerChunks.length, currentSlide]);

  const backgroundPool = useMemo(() => {
    const baseBackgrounds = Array.from({ length: 10 }, (_value, index) =>
      new URL(`../../assets/images/background/bg${index + 1}.png`, import.meta.url).href
    );
    return shuffleArray(baseBackgrounds);
  }, []);

  const slides = useMemo(
    () =>
      Array.from({ length: answerChunks.length }, (_, i) => ({
        id: i + 1,
        backgroundImg: backgroundPool[i % backgroundPool.length],
      })),
    [answerChunks.length, backgroundPool]
  );

  const defaultBackground = new URL("../../assets/images/background/bg1.png", import.meta.url).href;
  const currentBackgroundImg =
    slides[currentSlide]?.backgroundImg || slides[0]?.backgroundImg || defaultBackground;

  const persistAnswerListState = useCallback(() => {
    storeAnswerListState(cardId, currentSlide);
  }, [cardId, currentSlide]);

  const handleAnswerSelect = (answer: Answer, rect: DOMRect) => {
    const selectedBackground = currentBackgroundImg;
    const pageRect = pageWrapperRef.current?.getBoundingClientRect();
    if (!pageRect) {
      persistAnswerListState();
      navigate("/comments", {
        state: {
          answer,
          questionTitle: question,
          backgroundImg: selectedBackground,
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
        <BackgroundStrip offset={backgroundOffset} bgList={bgList}>
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
      <BackgroundStrip offset={backgroundOffset} bgList={bgList}>
        {bgList.map((src) => (
          <BackgroundItem key={src} src={src} />
        ))}
      </BackgroundStrip>
      <Overlay isVisible={true} bgColor={"rgba(0,0,0,0.6)"} disablePointerEvents />
      <QuestionHeader>{question}</QuestionHeader>
      <SliderWrapper ref={sliderWrapperRef} $disabled={Boolean(animationState)}>
        <Slider ref={sliderRef} {...settings}>
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

const BackgroundStrip = styled.div<{ offset: number; bgList: string[] }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${({ bgList }) => `${bgList.length * 100}vw`};
  display: flex;
  transform: translateX(${({ offset }) => `${offset}vw`});
`;

const BackgroundItem = styled.div<{ src: string }>`
  flex: 0 0 100vw;
  height: 100%;
  background: url(${({ src }) => src}) no-repeat;
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
