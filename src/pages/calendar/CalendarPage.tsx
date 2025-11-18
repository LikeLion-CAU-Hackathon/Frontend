import { useEffect, useState } from "react";
import styled from "styled-components";
import Footer from "../../components/common/Footer";
import LetterPage from "./LetterPage";
import CardGrid from "./components/CardGrid";
import { useNavigate, useLocation } from "react-router-dom";
import Overlay from "../../components/common/overlay/Overlay";
import Modal from "../../components/common/modal/Modal";
import { useCalendar } from "../../hooks/useCalendar";
import { getQuestion } from "../../apis/question/question.api";
import { getTodayDate } from "../../utils/date";
import { useAuthTokenHandler } from "../../hooks/useAuthTokenHandler";

const CalendarPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    cards,
    selectedCard,
    isCardOpened,
    handleCardClick,
    handleCloseLetter,
    modalMessage,
    closeNoticeModal,
    isCalendarLoading,
  } = useCalendar(navigate);

  const [questionText, setQuestionText] = useState("");
  const [isQuestionLoading, setIsQuestionLoading] = useState(false);
  const [questionError, setQuestionError] = useState<string | null>(null);

  useAuthTokenHandler({ location, navigate });

  // 질문 불러오기
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
        setQuestionError("로그인 후 오늘의 질문에 답변해보세요!");
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
    <PageContainer>
      {isCardOpened && (
        <Overlay isVisible onClick={handleCloseLetter} />
      )}
      {modalMessage && (
        <Modal
          isOpen={Boolean(modalMessage)}
          message={modalMessage}
          onClose={closeNoticeModal}
        />
      )}
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
      {isCalendarLoading && (
        <LoadingOverlay>
          <SpinnerWrapper>
            <Spinner />
            <LoadingText>캘린더를 준비하고 있어요...</LoadingText>
          </SpinnerWrapper>
        </LoadingOverlay>
      )}
    </PageContainer>
  );
};

export default CalendarPage;

const PageContainer = styled.main`
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

const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.6);
  z-index: 20;
  pointer-events: all;
`;

const SpinnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #A64848;
  font-family: "Gowun Batang", serif;
`;

const Spinner = styled.div`
  width: 54px;
  height: 54px;
  border-radius: 50%;
  border: 4px solid rgba(91, 58, 41, 0.2);
  border-top-color: #A64848;
  animation: spin 0.9s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: white;
`;
