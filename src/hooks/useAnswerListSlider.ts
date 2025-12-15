import { useEffect, useMemo, useRef, useState } from "react";
import type Slider from "react-slick";
import { shuffleWithSeed, getSeedFromCardId } from "../utils/random";
import type { Answer } from "../utils/answer";

interface Params {
  answers: Answer[];
  cardId: string | null;
  currentSlide: number;
  setCurrentSlide: (value: number) => void;
}

export function useAnswerListSlider({ answers, cardId, currentSlide, setCurrentSlide }: Params) {
  const sliderRef = useRef<Slider | null>(null);
  const sliderWrapperRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [backgroundOffset, setBackgroundOffset] = useState(() => -currentSlide * 100);

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
  }, [answerChunks.length, currentSlide, setCurrentSlide]);

  useEffect(() => {
    if (!sliderWrapperRef.current || answerChunks.length === 0) return;

    const initTimeout = setTimeout(() => {
      const trackElement = sliderWrapperRef.current?.querySelector(".slick-track") as HTMLElement;
      if (!trackElement) {
        setBackgroundOffset(-currentSlide * 100);
        return;
      }

      const updateBackgroundPosition = () => {
        if (!sliderWrapperRef.current) return;

        const track = sliderWrapperRef.current.querySelector(".slick-track") as HTMLElement;
        if (!track) return;

        const transform = window.getComputedStyle(track).transform;
        if (!transform || transform === "none") {
          setBackgroundOffset(-currentSlide * 100);
          rafRef.current = requestAnimationFrame(updateBackgroundPosition);
          return;
        }

        const matrix = transform.match(/matrix(?:3d)?\(([^)]+)\)/);
        if (!matrix) {
          setBackgroundOffset(-currentSlide * 100);
          rafRef.current = requestAnimationFrame(updateBackgroundPosition);
          return;
        }

        const values = matrix[1].split(",").map((v) => parseFloat(v.trim()));
        const translateX = values.length >= 6 ? values[4] : values.length >= 16 ? values[12] : 0;

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
      new URL(`../assets/images/background/bg${index + 1}.png`, import.meta.url).href
    );
    return shuffleWithSeed(baseBackgrounds, getSeedFromCardId(cardId));
  }, [cardId]);

  const slides = useMemo(
    () =>
      Array.from({ length: answerChunks.length }, (_unused, i) => ({
        id: i + 1,
        backgroundImg: backgroundPool[i % backgroundPool.length],
      })),
    [answerChunks.length, backgroundPool]
  );

  const bgList = useMemo(() => slides.map((slide) => slide.backgroundImg), [slides]);
  const defaultBackground = new URL("../assets/images/background/bg1.png", import.meta.url).href;
  const currentBackgroundImg =
    slides[currentSlide]?.backgroundImg || slides[0]?.backgroundImg || defaultBackground;

  return {
    sliderRef,
    sliderWrapperRef,
    backgroundOffset,
    answerChunks,
    slides,
    bgList,
    currentBackgroundImg,
  };
}

