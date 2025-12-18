import { useMemo, useState } from "react";
import type React from "react";
import type { Answer } from "@/utils/answer";
import type { AnimationState, RelativeRect } from "@/types/answerList";

interface Params {
  currentBackgroundImg: string;
  question: string;
  cardId: string | null;
  persistAnswerListState: () => void;
  pageWrapperRef: React.RefObject<HTMLElement | null>;
  navigate: any;
  setCurrentSlide: (value: number) => void;
}

export function useAnswerListAnimation({
  currentBackgroundImg,
  question,
  cardId,
  persistAnswerListState,
  pageWrapperRef,
  navigate,
  setCurrentSlide,
}: Params) {
  const [animationState, setAnimationState] = useState<AnimationState | null>(null);

  const handleAnswerSelect = (answer: Answer, rect: DOMRect) => {
    const pageRect = pageWrapperRef.current?.getBoundingClientRect();
    if (!pageRect) {
      persistAnswerListState();
      navigate("/comments", {
        state: {
          answer,
          questionTitle: question,
          backgroundImg: currentBackgroundImg,
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
      backgroundImg: currentBackgroundImg,
    };

    setAnimationState(nextState);

    window.requestAnimationFrame(() => {
      setAnimationState((prev) => (prev ? { ...prev, phase: "end" } : prev));
    });
  };

  const overlayStyle = useMemo(
    () =>
      animationState?.phase === "start"
        ? animationState.startRect
        : animationState?.targetRect,
    [animationState]
  );

  const handleSlideChange = (_current: number, next: number) => {
    setCurrentSlide(next);
  };

  return {
    animationState,
    setAnimationState,
    handleAnswerSelect,
    overlayStyle,
    handleSlideChange,
  };
}

