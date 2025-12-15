import { useEffect, useRef } from "react";
import { readStoredAnswerListState, clearStoredAnswerListState } from "../utils/storage";
import type { AnimationState } from "../types/answerList";

interface Params {
  cardId: string | null;
  setCurrentSlide: (value: number) => void;
  animationState: AnimationState | null;
  setAnimationState: (state: AnimationState | null) => void;
  question: string;
  navigate: any;
  setSearchParams: (params: Record<string, string>) => void;
  persistAnswerListState: () => void;
}

export function useAnswerListNavigation({
  cardId,
  setCurrentSlide,
  animationState,
  setAnimationState,
  question,
  navigate,
  setSearchParams,
  persistAnswerListState,
}: Params) {
  const animationTimeoutRef = useRef<number | null>(null);

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
  }, [cardId, setCurrentSlide, setSearchParams]);

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
  }, [animationState, cardId, navigate, persistAnswerListState, question, setAnimationState]);

  useEffect(() => {
    const goBackCalendar = () => {
      navigate(`/calendar`, { replace: true });
    };

    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", goBackCalendar);

    return () => window.removeEventListener("popstate", goBackCalendar);
  }, [navigate]);

  return {
    persistAnswerListState,
  };
}

