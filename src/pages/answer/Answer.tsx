import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Answer.module.css";
import { getFormattedToday, parseDateToDotted } from "../../utils/date";
import { useQuestion } from "../../hooks/useQuestion";
import { useUserProfile } from "../../hooks/useUserProfile";
import { useAnswerSubmit } from "../../hooks/useAnswerSubmit";
import closeIcon from "../../assets/images/comments/x.svg";

const Answer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = (location.state ?? {}) as {
    questionId?: number | null;
    questionText?: string;
    questionDate?: string | null;
  };

  const { questionId, questionText, questionDate } = locationState;

  const { questionTitle, isLoading: isQuestionLoading, error: questionError } = useQuestion({
    questionId,
    questionText,
    questionDate,
  });

  const { userNickname } = useUserProfile({ questionId });

  const { answerContents, isSubmitting, submitError, handleContentChange, handleSubmit } =
    useAnswerSubmit({
      questionId: questionId ?? null,
      questionText: questionTitle,
      questionDate,
    });

  const body = useMemo(() => {
    if (isQuestionLoading) return "질문을 불러오는 중입니다...";
    if (questionError) return questionError;
    const trimmed = questionTitle.trim();
    if (trimmed.length > 0) {
      return trimmed;
    }
    return "표시할 질문이 없습니다.";
  }, [isQuestionLoading, questionError, questionTitle]);

  const formattedDate = useMemo(() => parseDateToDotted(questionDate), [questionDate]);
  const fallbackDate = useMemo(() => getFormattedToday(), []);
  const subText = formattedDate ?? fallbackDate;
  const fromLabel = `From. ${userNickname}`;

  return (
    <div className={styles.container}>
      <button type="button" className={styles.closeButton} onClick={() => navigate("/calendar")} aria-label="닫기">
        <img src={closeIcon} alt="닫기" />
      </button>
      <section className={styles.answerSection}>
      <section className={styles.questionSection}>
        <h2 className={styles.questionTitle}>{body}</h2>
      </section>

      <p className={styles.fromText}>{fromLabel}</p>

      <form className={styles.answerForm} aria-label="답변 입력 영역" onSubmit={handleSubmit}>
        <div className={styles.paper}>
          <textarea
            className={styles.answerInput}
            placeholder="편지 내용을 작성해 주세요."
            value={answerContents}
            onChange={(event) => handleContentChange(event.target.value)}
            aria-label="답변 내용 입력"
            maxLength={500}
            disabled={isSubmitting}
          />
        </div>
        <div className={styles.footerWrapper}>
        {submitError && <p className={styles.errorMessage}>{submitError}</p>}
        <div className={styles.answerFooter}>
          <p className={styles.questionSubtitle}>{subText}</p>
          <button className={styles.submitButton} type="submit" disabled={isSubmitting}>
            {isSubmitting ? "전송 중..." : "답변하기"}
          </button>
          </div>
        </div>
      </form>
      </section>
    </div>
  );
};

export default Answer;
