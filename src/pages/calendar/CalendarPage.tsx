import styled from "styled-components";
import Footer from "../../components/common/Footer";
import { useRef, useState } from "react";
import type { Card } from "../../types/card";
import LetterPage from "./LetterPage";
import CardGrid from "./components/CardGrid";
import { getQuestion } from "../../apis/question/question.api";
import { GOOGLE_AUTH_URL } from "../../constants/oauth";
import axios from "axios";

const TOTAL_STAMPS = 24;
const FIRST_QUESTION_DATE = Date.UTC(2025, 11, 1); // 2025-12-01

const createQuestionDate = (offset: number) => {
  const date = new Date(FIRST_QUESTION_DATE);
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().split("T")[0];
};

const createInitialCards = (): Card[] =>
  Array.from({ length: TOTAL_STAMPS }, (_, index) => ({
    id: index + 1,
    date: createQuestionDate(index),
    image: "",
    isOpened: false,
    isExpired: false,
    isAnswered: false,
  }));

const extractQuestionText = (payload: unknown): string => {
  if (!payload) return "";
  if (typeof payload === "string") return payload;
  if (typeof (payload as any).question === "string") return (payload as any).question;
  if (typeof (payload as any).data === "string") return (payload as any).data;
  if (typeof (payload as any).data?.question === "string") return (payload as any).data.question;
  return "";
};

const CalendarPage = () => {
  const [cards, setCards] = useState<Card[]>(createInitialCards);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [questionText, setQuestionText] = useState("");
  const [questionError, setQuestionError] = useState<string | null>(null);
  const [isQuestionLoading, setIsQuestionLoading] = useState(false);
  const activeQuestionDateRef = useRef<string | null>(null);

  const fetchQuestionForCard = async (card: Card) => {
    activeQuestionDateRef.current = card.date;
    setIsQuestionLoading(true);
    setQuestionError(null);
    setQuestionText("");

    try {
      const response = await getQuestion(card.date);
      const resolvedQuestion = extractQuestionText(response);

      if (activeQuestionDateRef.current === card.date) {
        setQuestionText(resolvedQuestion);
      }
    } catch (error) {
      console.error("질문을 불러오는 데 실패했습니다.", error);
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
          window.location.href = GOOGLE_AUTH_URL;
          return;
        }
      }
      if (activeQuestionDateRef.current === card.date) {
        setQuestionError("질문을 불러오는데 실패했습니다.");
      }
    } finally {
      if (activeQuestionDateRef.current === card.date) {
        setIsQuestionLoading(false);
      }
    }
  };

  const handleCardClick = (id: number) => {
    const clickedCard = cards.find((card) => card.id === id);
    if (!clickedCard) return;

    setCards((prevCards) =>
      prevCards.map((card) => ({
        ...card,
        isOpened: card.id === id,
      }))
    );

    setSelectedCard(clickedCard);
    fetchQuestionForCard(clickedCard);
  };

  const isCardOpened = cards.some((card) => card.isOpened);

  const handleCloseLetter = () => {
    setCards((prev) => prev.map((card) => ({ ...card, isOpened: false })));
    setSelectedCard(null);
    setQuestionText("");
    setQuestionError(null);
    setIsQuestionLoading(false);
    activeQuestionDateRef.current = null;
  };

  return (
    <PageContainer isOpened={isCardOpened}>
      {isCardOpened && <Overlay isVisible={isCardOpened} onClick={handleCloseLetter} />}
      <MainContent>
        <CardGrid cards={cards} onCardClick={handleCardClick} />
      </MainContent>
      <LetterPage
        card={selectedCard}
        isOpened={isCardOpened}
        question={questionText}
        isLoading={isQuestionLoading}
        error={questionError}
      />
      <Footer />
    </PageContainer>
  );
};

export default CalendarPage;

const Overlay = styled.div<{ isVisible: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  transition: opacity 0.3s ease-in-out;
  z-index: 1;
  pointer-events: auto;
`;

const PageContainer = styled.main<{ isOpened: boolean }>`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 25px;
  position: relative;
`;

const MainContent = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
`;
