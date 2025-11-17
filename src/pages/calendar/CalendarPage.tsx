import { useEffect, useState } from "react";
import styled from "styled-components";
import Footer from "../../components/common/Footer";
import LetterPage from "./LetterPage";
import CardGrid from "./components/CardGrid";
import { useNavigate, useLocation } from "react-router-dom";
import Overlay from "../../components/common/Overlay/Overlay";
import Modal from "../../components/common/Modal/Modal";
import { useCalendar } from "../../hooks/useCalendar";
import { getQuestion } from "../../apis/question/question.api";
import { getTodayDate } from "../../utils/date";
import { setAccessToken, setTokens, getAccessToken } from "../../utils/token";

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
  } = useCalendar(navigate);

  const [questionText, setQuestionText] = useState("");
  const [isQuestionLoading, setIsQuestionLoading] = useState(false);
  const [questionError, setQuestionError] = useState<string | null>(null);

  useEffect(() => {
    // 이미 토큰이 있으면 체크하지 않음
    if (getAccessToken()) {
      console.log("토큰이 이미 존재함");
      return;
    }

    const hash = location.hash.slice(1); // "#" 제거
    console.log("토큰이 URL에 있는지 확인: ", hash);

    if (!hash) {
      console.log("URL에 hash가 없습니다.");
      return;
    }

    // 토큰 추출 함수
    const extractToken = (str: string, key: string) => {
      const regex = new RegExp(`${key}=([^&]*)`);
      const match = str.match(regex);
      return match ? decodeURIComponent(match[1]) : null;
    };

    // accessToken과 refreshToken 추출
    const accessToken = 
      extractToken(hash, "accessToken") ||
      extractToken(hash, "access_token");

    const refreshToken = 
      extractToken(hash, "refreshToken") ||
      extractToken(hash, "refresh_token");

    console.log("accessToken:", accessToken ? `${accessToken.slice(0, 30)}...` : "NO");
    console.log("refreshToken:", refreshToken ? `${refreshToken.slice(0, 30)}...` : "NO");

    // 토큰이 있으면 저장
    if (accessToken) {
      try {
        if (refreshToken) {
          console.log("localStorage에 저장중");
          setTokens(accessToken, refreshToken);
        } else {
          console.log("localStorage에 저장중");
          setAccessToken(accessToken);
        }
        
        console.log("토큰 저장");
        
        // URL에서 hash 제거 (토큰을 URL에 남기지 않기 위해)
        navigate(location.pathname + location.search, { replace: true });
      } catch (error) {
        console.error("토큰을 저장하는데 오류가 발생했습니다.", error);
      }
    }
  }, [location.hash, location.pathname, location.search, navigate]);

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
    <PageContainer isOpened={isCardOpened}>
      {isCardOpened && (
        <Overlay isVisible={isCardOpened} onClick={handleCloseLetter} />
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
    </PageContainer>
  );
};

export default CalendarPage;

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