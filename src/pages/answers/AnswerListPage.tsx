import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AnswerSlide from "./components/AnswerSlide";
import styled from "styled-components";
import Footer from "../../components/common/Footer";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Overlay from "../../components/common/overlay/Overlay";
import { checkAnswered, getAnswerList } from "../../apis/answer/answer.api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getQuestion } from "../../apis/question/question.api";
import { convertIdToDate } from "../../utils/date";
import type { AnswerCardData } from "../../components/common/AnswerCard";
import closeIcon from "../../assets/images/Comments/x.svg";
import heartIcon from "../../assets/images/Comments/heart.svg";
import commentIcon from "../../assets/images/Comments/comment.svg";
import { getMyProfile } from "../../apis/user/user.api";
import { useCalendar } from "../../hooks/useCalendar";
import { AiOutlineClose } from "react-icons/ai";
import Modal from "../../components/common/modal/Modal";

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
  writerNickname?: string;
  isMine?: boolean;
};

const monthLabels = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

const formatCardDateLabel = (value?: string | null): string => {
  if (!value) return "";
  const trimmed = value.trim();
  if (trimmed.length === 0) return "";
  const isoMatch = /^(\d{4})[-/.](\d{2})[-/.](\d{2})/.exec(trimmed);
  if (isoMatch) {
    const [, , month, day] = isoMatch;
    const monthIndex = Number(month) - 1;
    const label = monthLabels[monthIndex] ?? month.toUpperCase();
    const dayNumber = Number(day);
    return `${label} ${Number.isFinite(dayNumber) ? dayNumber : day}`;
  }
  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    const month = parsed.toLocaleString("en-US", { month: "short" }).toUpperCase();
    const day = parsed.getDate();
    return `${month} ${day}`;
  }
  return trimmed;
};

const extractDateTimeFromTimestamp = (
  timestamp?: string | null
): { date: string; time: string } => {
  if (!timestamp) return { date: "", time: "" };
  const trimmed = timestamp.trim();
  if (trimmed.length === 0) return { date: "", time: "" };

  const isoMatch =
    /^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2})(?::?(\d{2}))?(?::?(\d{2}))?)?/.exec(trimmed);
  if (isoMatch) {
    const [, year, month, day, hour, minute] = isoMatch;
    const date = formatCardDateLabel(`${year}-${month}-${day}`);
    const hh = hour ? hour.padStart(2, "0") : "";
    const mm = minute ? minute.padStart(2, "0") : "";
    const time = hh ? `${hh}:${mm || "00"}` : "";
    return { date, time };
  }

  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    const date = formatCardDateLabel(trimmed);
    const hours = String(parsed.getHours()).padStart(2, "0");
    const minutes = String(parsed.getMinutes()).padStart(2, "0");
    return { date, time: `${hours}:${minutes}` };
  }

  return { date: formatCardDateLabel(trimmed), time: "" };
};

const stripOwnIndicator = (name: string): string =>
  name.replace(/\s*\(나\)\s*$/, "");

const updateAnswerOwnership = (
  list: Answer[],
  nickname: string | null
): Answer[] => {
  if (!Array.isArray(list) || list.length === 0) {
    return list;
  }

  let changed = false;
  const updated = list.map((answer) => {
    const baseName =
      answer.writerNickname ??
      (typeof answer.author === "string" ? stripOwnIndicator(answer.author) : answer.author);

    if (!baseName) {
      return answer;
    }

    const isMine = Boolean(nickname && baseName === nickname);
    const displayAuthor = isMine ? `${baseName} (나)` : baseName;

    if (
      answer.author === displayAuthor &&
      answer.isMine === isMine &&
      answer.writerNickname === baseName
    ) {
      return answer;
    }

    changed = true;
    return {
      ...answer,
      author: displayAuthor,
      isMine,
      writerNickname: baseName,
    };
  });

  return changed ? updated : list;
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

const createSeededRandom = (seed: number) => {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
};

const shuffleWithSeed = <T,>(array: T[], seed: number): T[] => {
  const random = createSeededRandom(seed);
  const result = [...array];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const getSeedFromCardId = (value: string | null): number => {
  if (!value) return 1;
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = Math.imul(31, hash) + value.charCodeAt(i);
    hash |= 0;
  }
  return hash || 1;
};

const AnswerListPage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState<string>("");
  const [animationState, setAnimationState] = useState<AnimationState | null>(null);
  const [myNickname, setMyNickname] = useState<string | null>(null);
  const pageWrapperRef = useRef<HTMLElement | null>(null);
  const animationTimeoutRef = useRef<number | null>(null);
  const myNicknameRef = useRef<string | null>(null);
  const sliderRef = useRef<Slider | null>(null);
  const sliderWrapperRef = useRef<HTMLDivElement | null>(null);
  const [backgroundOffset, setBackgroundOffset] = useState(() => -currentSlide * 100);
  const rafRef = useRef<number | null>(null);
  const [accessChecked, setAccessChecked] = useState(false);
  const [canAccess, setCanAccess] = useState(false);

  // URL params에서 cardId 가져오기
  const [searchParams, setSearchParams] = useSearchParams();
  const cardId = searchParams.get("cardId") || searchParams.get("questionId");


  // 답변 여부 확인 후 페이지 접근 허용
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    if (!cardId) {
      setLoading(false);
      setAccessChecked(true);
      setCanAccess(false);
      return;
    }

    let cancelled = false;

    const checkAccess = async () => {
      try {
        const response = await checkAnswered(Number(cardId));
        console.log("답변여부" ,response.answered);

        if (cancelled) return;

        if (!response.answered) {
          setModalMessage("답변하지 않은 질문에 대한 접근입니다. \n당장 내쫓겠습니다🎅🏻");
          setIsModalOpen(true);
          setCanAccess(false);
          setLoading(false);
          return;
        }

        setCanAccess(true);
      } catch (e) {
        if (cancelled) return;
        console.error("답변 여부 확인 실패", e);
        setModalMessage("접근할 수 없는 페이지입니다.");
        setIsModalOpen(true);
        setCanAccess(false);
        setLoading(false);
      } finally {
        if (!cancelled) {
          setAccessChecked(true);
        }
      }
    };

    checkAccess();

    return () => {
      cancelled = true;
    };
  }, [cardId, navigate]);

  const handleModalClose = () => {
      setIsModalOpen(false);
      navigate("/calendar", { replace: true });
    };


  useEffect(() => {
    if (!canAccess) return;
    console.log("접근", canAccess);

    let cancelled = false;
    const cardIdNumber =
      typeof cardId === "string" && cardId.trim().length > 0 ? Number(cardId) : NaN;
    const questionIdParam = Number.isFinite(cardIdNumber) ? cardIdNumber : undefined;
    const fetchProfile = async () => {
      try {
        const profile = await getMyProfile(questionIdParam);
        const nickname =
          profile?.nickname ??
          profile?.userNickname ??
          profile?.name ??
          profile?.username ??
          null;
        if (!cancelled) {
          setMyNickname(nickname);
        }
      } catch (error) {
        console.error("내 프로필 정보를 불러오지 못했습니다:", error);
        if (!cancelled) {
          setMyNickname(null);
        }
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [cardId, canAccess]);

  // 기본 뒤로가기 차단하고 뒤로가기 하면 무조건 캘린더로
  useEffect(() => {
    const goBackCalendar = () => {
      navigate(`/calendar`, { replace: true });
    };
 
    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", goBackCalendar);
 
    return () => window.removeEventListener("popstate", goBackCalendar);
  }, [navigate]);

  // cardId로 질문과 답변 리스트 불러오기
  useEffect(() => {
    if (!canAccess) return;
    if (!cardId) {
      setLoading(false);
      return;
    }

    const fetchQuestionAndAnswers = async () => {
      try {
        setLoading(true);
        const cardIdNumber = Number(cardId);

        const date = convertIdToDate(cardIdNumber);
        const questionResponse = await getQuestion(date);
        setQuestion(questionResponse.content || "");

        const answerData = await getAnswerList(cardIdNumber);

        const mappedData = answerData.map((response: any) => {
          const writerNickname =
            response.userNickname ??
            response.nickname ??
            response.userName ??
            response.author ??
            "익명";

          const likedAnswers = JSON.parse(localStorage.getItem("likedAnswers") || "[]");
          const isLiked = likedAnswers.includes(response.answerId) || response.liked || false;

          const { date: formattedDate, time: formattedTime } = extractDateTimeFromTimestamp(
            response.createdTime
          );

          return {
            id: response.answerId,
            author: writerNickname,
            writerNickname,
            date: formattedDate,
            time: formattedTime,
            contents: response.contents,
            likes: response.likeCount,
            comments: response.replyCount,
            liked: isLiked,
          };
        });

        const nicknameSnapshot = myNicknameRef.current ?? null;
        setAnswers(updateAnswerOwnership(mappedData, nicknameSnapshot));
      } catch (error) {
        console.error("질문 또는 답변 리스트를 불러오는 데 오류가 발생했습니다: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionAndAnswers();
  }, [cardId, canAccess]);

  useEffect(() => {
    setAnswers((prev) => updateAnswerOwnership(prev, myNickname));
  }, [myNickname]);

  useEffect(() => {
    myNicknameRef.current = myNickname;
  }, [myNickname]);

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
    return shuffleWithSeed(baseBackgrounds, getSeedFromCardId(cardId));
  }, [cardId]);

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

  const { handleGoBacktoCalendar } = useCalendar(navigate);
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
