import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Answer.module.css";
import tornPaperTexture from "../../assets/images/letters.svg";

const Answer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = (location.state ?? {}) as {
    questionId?: number | null;
    questionText?: string;
    questionDate?: string | null;
  };

  const { questionId, questionText, questionDate } = locationState;

  const heading = useMemo(() => {
    if (typeof questionId === "number" && Number.isFinite(questionId)) {
      return `${questionId}번째 질문`;
    }
    return "질문을 선택해주세요";
  }, [questionId]);

  const body = useMemo(() => {
    const trimmed = questionText?.trim() ?? "";
    if (trimmed.length > 0) {
      return trimmed;
    }
    return "캘린더에서 질문을 선택하면 내용이 표시됩니다.";
  }, [questionText]);

  const formattedDate = useMemo(() => {
    if (!questionDate || questionDate.trim().length === 0) return null;
    const parsed = new Date(questionDate);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed.toLocaleDateString("ko-KR", { month: "long", day: "numeric" });
  }, [questionDate]);

  const subText = formattedDate ?? "오늘의 질문에 답을 작성해 보세요.";

  return (
    <div className={styles.container}>
      <section className={styles.questionSection}>
        <p className={styles.questionOrder}>{heading}</p>
        <h2 className={styles.questionTitle}>{body}</h2>
        <p className={styles.questionSubtitle}>{subText}</p>
      </section>

      <section className={styles.answerSection} aria-label="답변 입력 영역">
        <div className={styles.paper}>
          <div className={styles.paperTexture} style={{ backgroundImage: `url(${tornPaperTexture})` }} />
          <p className={styles.answerPreview}>편지 내용을 작성해 주세요.</p>
        </div>
        <button className={styles.submitButton} type="button" onClick={() => navigate(-1)}>
          이전으로 돌아가기
        </button>
      </section>
    </div>
  );
};

export default Answer;
