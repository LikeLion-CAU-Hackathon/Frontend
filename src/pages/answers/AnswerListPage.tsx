import { useEffect, useMemo, useRef, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import AnswerSlide from "./components/AnswerSlide";
import Footer from "../../components/common/Footer";
import Overlay from "../../components/common/Overlay/Overlay";
import { getAnswerList } from "../../apis/answer/answer.api";
import type { AnswerCardData } from "../../components/common/AnswerCard";
import closeIcon from "../../assets/images/Comments/x.svg";
import heartIcon from "../../assets/images/Comments/heart.svg";
import commentIcon from "../../assets/images/Comments/comment.svg";

type Answer = AnswerCardData;

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
}

const AnswerListPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = (location.state ?? {}) as {
    questionId?: number;
    questionText?: string;
    questionDate?: string;
  };

  const deriveQuestionId = () => {
    const params = new URLSearchParams(location.search);
    const paramId = params.get("questionId");
    const fallbackId = locationState.questionId;
    const parsedId = Number(paramId ?? fallbackId ?? 1);
    return Number.isNaN(parsedId) || parsedId <= 0 ? 1 : parsedId;
  };

  const [currentSlide, setCurrentSlide] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [questionId, setQuestionId] = useState<number>(() => deriveQuestionId());
  const [questionTitle, setQuestionTitle] = useState(
    () => (typeof locationState.questionText === "string" ? locationState.questionText : "")
  );
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [animationState, setAnimationState] = useState<AnimationState | null>(null);
  const pageWrapperRef = useRef<HTMLElement | null>(null);
  const animationTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const nextId = deriveQuestionId();
    if (nextId !== questionId) {
      setQuestionId(nextId);
      setCurrentSlide(0);
    }
    if (typeof locationState.questionText === "string") {
      setQuestionTitle(locationState.questionText);
    }
  }, [location]);

  useEffect(() => {
    const fetchAnswers = async () => {
      if (!questionId) return;
      setIsLoading(true);
      setFetchError(null);
      try {
        const data = await getAnswerList(questionId);
        const mappedData: Answer[] = Array.isArray(data)
          ? data.map((response: any) => ({
              id: response.answerId ?? response.id,
              author: response.userName,
              date: response.createdTime.slice(0, 10),
              time: response.createdTime.slice(11, 16),
              contents: response.contents,
              likes: response.likeCount,
              comments: response.replyCount,
            }))
          : [];
        setAnswers(mappedData);
      } catch (error) {
        console.error("답변 리스트를 불러오는 데 오류가 발생했습니다: ", error);
        setAnswers([]);
        setFetchError("답변을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnswers();
  }, [questionId]);

  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        window.clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!animationState || animationState.phase !== "end") return;

    if (animationTimeoutRef.current) {
      window.clearTimeout(animationTimeoutRef.current);
    }

    animationTimeoutRef.current = window.setTimeout(() => {
      navigate("/comments", { state: { answer: animationState.answer, questionTitle } });
      setAnimationState(null);
    }, 650);
  }, [animationState, navigate, questionTitle]);

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

  const slides = useMemo(() => {
    if (answerChunks.length === 0) return [];
    return answerChunks.map((_, index) => ({
      id: index + 1,
      backgroundImg: new URL(`../../assets/images/background/bg${(index % 10) + 1}.png`, import.meta.url).href,
    }));
  }, [answerChunks.length]);

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

  const handleAnswerSelect = (answer: Answer, rect: DOMRect) => {
    const pageRect = pageWrapperRef.current?.getBoundingClientRect();
    if (!pageRect) {
      navigate("/comments", { state: { answer, questionTitle } });
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

  const questionHeading =
    questionTitle?.trim() ||
    `Question #${questionId}`;

  return (
    <PageWrapper ref={pageWrapperRef} backgroundImg={currentBackgroundImg}>
      <Overlay isVisible={true} bgColor={"rgba(0,0,0,0.6)"} disablePointerEvents />
      <QuestionHeader>{questionHeading}</QuestionHeader>
      <SliderWrapper $disabled={Boolean(animationState)}>
        {isLoading && <StatusMessage>답변을 불러오는 중입니다...</StatusMessage>}
        {fetchError && !isLoading && <StatusMessage>{fetchError}</StatusMessage>}
        {!isLoading && !fetchError && totalSlides === 0 && (
          <StatusMessage>아직 등록된 답변이 없습니다.</StatusMessage>
        )}
        {totalSlides > 0 && !isLoading && (
          <AnswerSlide
            answers={answerChunks[currentSlide] || []}
            onAnswerSelect={handleAnswerSelect}
          />
        )}
        {totalSlides > 1 && !isLoading && (
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
      <FooterWrapper>
        <Footer />
      </FooterWrapper>

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
};

export default AnswerListPage;

const PageWrapper = styled.main<{ backgroundImg: string }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  overflow: hidden;
  background: url(${({ backgroundImg }) => backgroundImg}) no-repeat center;
  background-attachment: fixed;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 0 16px 48px;
  pointer-events: ${({ $disabled }) => ($disabled ? "none" : "auto")};
  opacity: ${({ $disabled }) => ($disabled ? 0.4 : 1)};
  position: relative;
  z-index: 1;
`;

const SlideControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const NavButton = styled.button`
  padding: 8px 18px;
  border-radius: 999px;
  border: none;
  background: rgba(255, 255, 255, 0.25);
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, opacity 0.2s ease;

  &:hover:enabled {
    background: rgba(255, 255, 255, 0.5);
  }

  &:disabled {
    opacity: 0.4;
    cursor: default;
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

const AnimatedBackdrop = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 10;
`;

const FooterWrapper = styled.div`
  width: 100%;
  position: relative;
  z-index: 1;
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

const StatusMessage = styled.p`
  color: #ffffff;
  font-size: 16px;
  text-align: center;
  margin: 24px 0;
`;
