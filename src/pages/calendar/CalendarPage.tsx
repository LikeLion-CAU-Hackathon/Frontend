import { useEffect, useState } from "react";
import styled from "styled-components";
import Footer from "../../components/common/Footer";
import LetterPage from "./LetterPage";
import CardGrid from "./components/CardGrid";
import { useNavigate } from "react-router-dom";
import Overlay from "../../components/common/Overlay/Overlay";
import { useCalendar } from "../../hooks/useCalendar";
import { getQuestion } from "../../apis/question/question.api";
import { getTodayDate } from "../../utils/date";

const CalendarPage = () => {
  const navigate = useNavigate();

  const {
    cards,
    selectedCard,
    isCardOpened,
    handleCardClick,
    handleCloseLetter,
  } = useCalendar(navigate);

  const [questionText, setQuestionText] = useState("");
  const [isQuestionLoading, setIsQuestionLoading] = useState(false);
  const [questionError, setQuestionError] = useState<string | null>(null);

  useEffect(() => {
    if (!isCardOpened || !selectedCard) return;

    const fetchQuestion = async () => {
      setIsQuestionLoading(true);
      setQuestionError(null);
      try {
        const identifier = selectedCard.date?.trim() || getTodayDate();
        const response = await getQuestion(identifier);
        const content = response?.content ?? response?.question ?? "";
        setQuestionText(content);
      } catch (error) {
        console.error("오늘의 질문을 불러오지 못했습니다:", error);
        setQuestionText("");
        setQuestionError("질문을 불러오지 못했습니다.");
      } finally {
        setIsQuestionLoading(false);
      }
    };

    fetchQuestion();
  }, [isCardOpened, selectedCard]);

  useEffect(() => {
    if (!isCardOpened) {
      setQuestionText("");
      setQuestionError(null);
      setIsQuestionLoading(false);
    }
  }, [isCardOpened]);

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

const PageContainer = styled.main<{isOpened : boolean}>`
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
