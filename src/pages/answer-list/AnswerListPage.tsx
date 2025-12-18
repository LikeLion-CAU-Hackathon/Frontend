import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AnswerSlide from "@/pages/answer-list/components/AnswerSlide";
import styled from "styled-components";
import Footer from "@/components/common/Footer";
import { useCallback, useRef, useState } from "react";
import Overlay from "@/components/common/overlay/Overlay";
import { useNavigate, useSearchParams } from "react-router-dom";
import closeIcon from "@/assets/images/comments/x.svg";
import heartIcon from "@/assets/images/comments/heart.svg";
import commentIcon from "@/assets/images/comments/comment.svg";
import { useCalendar } from "@/hooks/useCalendar";
import { AiOutlineClose } from "react-icons/ai";
import Modal from "@/components/common/modal/Modal";
import { useAnswerListAccess } from "@/hooks/useAnswerListAccess";
import { useAnswerListData } from "@/hooks/useAnswerListData";
import { useAnswerListSlider } from "@/hooks/useAnswerListSlider";
import { useAnswerListAnimation } from "@/hooks/useAnswerListAnimation";
import { useAnswerListNavigation } from "@/hooks/useAnswerListNavigation";
import { storeAnswerListState } from "@/utils/storage";
import type { AnimationPhase } from "@/types/answerList";

const AnswerListPage = () => {
  const navigate = useNavigate();
  const pageWrapperRef = useRef<HTMLElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const cardId = searchParams.get("cardId") || searchParams.get("questionId");

  const {
    accessChecked,
    canAccess,
    isModalOpen,
    modalMessage,
    handleModalClose,
  } = useAnswerListAccess({ cardId, navigate, setLoading });

  const {
    answers,
    question,
  } = useAnswerListData({ cardId, canAccess, setLoading });

  const {
    sliderRef,
    sliderWrapperRef,
    backgroundOffset,
    answerChunks,
    slides,
    bgList,
    currentBackgroundImg,
  } = useAnswerListSlider({ answers, cardId, currentSlide, setCurrentSlide });

  const persistAnswerListState = useCallback(() => {
    storeAnswerListState(cardId, currentSlide);
  }, [cardId, currentSlide]);

  const {
    animationState,
    setAnimationState,
    handleAnswerSelect,
    overlayStyle,
    handleSlideChange,
  } = useAnswerListAnimation({
    currentBackgroundImg,
    question,
    cardId,
    persistAnswerListState,
    pageWrapperRef,
    navigate,
    setCurrentSlide,
  });

  useAnswerListNavigation({
    cardId,
    setCurrentSlide,
    animationState,
    setAnimationState,
    question,
    navigate,
    setSearchParams,
    persistAnswerListState,
  });

  const { handleGoBacktoCalendar } = useCalendar(navigate);
  const settings = {
    dots: true,
    infinite: false,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: handleSlideChange,
  };
  const showLoadingView = loading || !accessChecked;

  if (showLoadingView) {
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

  // 접근 불가(답변하지 않은 상태 등)일 때는 다른 UI를 전혀 렌더링하지 않고 모달만 노출
  if (!canAccess) {
    return (
      <>
        <Modal
          isOpen={isModalOpen}
          message={modalMessage}
          onClose={handleModalClose}
        />
      </>
    );
  }

  return (
    <PageWrapper>
      <CloseButton onClick={handleGoBacktoCalendar}>
        <CloseIcon />
      </CloseButton>
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
  background: url(${({ src }) => src}) repeat;
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
  white-space: pre-line;
`;

const SliderWrapper = styled.section<{ $disabled?: boolean }>`
  width: 100%;
  max-width: 100vw;
  z-index: 2;
  pointer-events: ${({ $disabled }) => ($disabled ? "none" : "auto")};
  padding-bottom: 72px; /* keep dots clear of footer */
  box-sizing: border-box;

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
  font-size: 14px;
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

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  border: none;
  width: 36px;
  height: 36px;
  color: white;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
`;

const CloseIcon = styled(AiOutlineClose)`
  position: absolute;
  z-index: 100000;
  color: white;
  width: 24px;
  height: 24px;
`;
