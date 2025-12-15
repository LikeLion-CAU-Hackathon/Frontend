import styled from "styled-components";
import Footer from "../../components/common/Footer";
import LetterPage from "./LetterPage";
import CardGrid from "./components/CardGrid";
import { useNavigate, useLocation } from "react-router-dom";
import { useCalendar } from "../../hooks/useCalendar";
import { useAuthTokenHandler } from "../../hooks/useAuthTokenHandler";
import { useQuestion } from "../../hooks/useQuestion";
import CalendarOverlay from "./components/CalendarOverlay";

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

  useAuthTokenHandler({ location, navigate });

  const { questionTitle: questionText, isLoading: isQuestionLoading, error: questionError } =
    useQuestion({
      questionId: selectedCard?.id ?? null,
      questionDate: isCardOpened ? selectedCard?.date ?? null : null,
    });

  return (
    <PageContainer>
      <CalendarOverlay
        isCardOpened={isCardOpened}
        onCloseLetter={handleCloseLetter}
        modalMessage={modalMessage}
        onCloseModal={closeNoticeModal}
      />
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
