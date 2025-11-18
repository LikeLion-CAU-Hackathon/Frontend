import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./WriteAnswer.module.css";
import { getQuestion } from "../../apis/question/question.api";
import { getTodayDate } from "../../utils/date";
import { postAnswerReply } from "../../apis/answer/answer.api";
import { getMyProfile } from "../../apis/user/user.api";
import closeIcon from "../../assets/images/Comments/x.svg";

const formatDottedDate = (year: string, month: string, day: string) => `${year}. ${month}. ${day}`;

const WriteAnswer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = (location.state ?? {}) as {
    questionId?: number | null;
    questionText?: string;
    questionDate?: string | null;
  };

  const { questionId, questionText, questionDate } = locationState;
  const [questionTitle, setQuestionTitle] = useState(() => questionText?.trim() ?? "");
  const [isQuestionLoading, setIsQuestionLoading] = useState(false);
  const [questionError, setQuestionError] = useState<string | null>(null);
  const [answerContents, setAnswerContents] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [userNickname, setUserNickname] = useState("중커톤");
  const fromLabel = `From. ${userNickname}`;

  useEffect(() => {
    const trimmed = questionText?.trim() ?? "";
    if (trimmed.length > 0) {
      setQuestionTitle(trimmed);
      setIsQuestionLoading(false);
      setQuestionError(null);
      return;
    }

    const identifier = (() => {
      if (questionDate && questionDate.trim().length > 0) {
        return questionDate.trim();
      }
      if (typeof questionId === "number" && Number.isFinite(questionId) && questionId > 0) {
        return questionId;
      }
      return getTodayDate();
    })();

    let isMounted = true;
    const fetchQuestion = async () => {
      setIsQuestionLoading(true);
      setQuestionError(null);
      try {
        const response = await getQuestion(identifier);
        const fetchedQuestion = response?.content ?? response?.question ?? "";
        if (isMounted) {
          setQuestionTitle(fetchedQuestion);
        }
      } catch (error) {
        console.error("질문을 불러오지 못했습니다: ", error);
        if (isMounted) {
          setQuestionTitle("");
          setQuestionError("로그인 후 오늘의 질문에 답변해보세요!");
        }
      } finally {
        if (isMounted) {
          setIsQuestionLoading(false);
        }
      }
    };

    fetchQuestion();

    return () => {
      isMounted = false;
    };
  }, [questionDate, questionId, questionText]);

  const body = useMemo(() => {
    if (isQuestionLoading) return "질문을 불러오는 중입니다...";
    if (questionError) return questionError;
    const trimmed = questionTitle.trim();
    if (trimmed.length > 0) {
      return trimmed;
    }
    return "표시할 질문이 없습니다.";
  }, [isQuestionLoading, questionError, questionTitle]);

  const formattedDate = useMemo(() => {
    if (!questionDate) return null;
    const trimmed = questionDate.trim();
    if (trimmed.length === 0) return null;

    const [yyyy, mm = "", ddRaw = ""] = trimmed.split("T")[0]?.split("-") ?? [];
    if (yyyy && mm && ddRaw) {
      const shortYear = yyyy.slice(-2);
      const month = mm.padStart(2, "0");
      const day = ddRaw.slice(0, 2).padStart(2, "0");
      return formatDottedDate(shortYear, month, day);
    }

    const parsed = new Date(trimmed);
    if (Number.isNaN(parsed.getTime())) return null;
    const yy = String(parsed.getFullYear()).slice(-2);
    const month = String(parsed.getMonth() + 1).padStart(2, "0");
    const day = String(parsed.getDate()).padStart(2, "0");
    return formatDottedDate(yy, month, day);
  }, [questionDate]);

  const fallbackDate = useMemo(() => {
    const today = getTodayDate();
    const [yyyy, mm = "", ddRaw = ""] = today.split("-");
    if (yyyy && mm && ddRaw) {
      const shortYear = yyyy.slice(-2);
      const month = mm.padStart(2, "0");
      const day = ddRaw.slice(0, 2).padStart(2, "0");
      return formatDottedDate(shortYear, month, day);
    }
    return "";
  }, []);

  const questionIdForProfile =
    typeof questionId === "number" && Number.isFinite(questionId) ? questionId : undefined;

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        const profile = await getMyProfile(questionIdForProfile);
        const nickname =
          profile?.nickname ??
          profile?.userNickname ??
          profile?.name ??
          profile?.username ??
          "중커톤";
        if (isMounted) {
          setUserNickname(nickname);
        }
      } catch (error) {
        console.error("사용자 닉네임을 가져오지 못했습니다:", error);
      }
    };
    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, [questionIdForProfile]);

  const subText = formattedDate ?? fallbackDate;

  const handleSubmit = async (event?: FormEvent) => {
    event?.preventDefault();
    const trimmedContents = answerContents.trim();
    if (trimmedContents.length === 0) {
      setSubmitError("답변 내용을 입력해 주세요.");
      return;
    }

    if (trimmedContents.length > 120) {
      setSubmitError("답변이 너무 길어서 전송에 실패했어요.");
      return;
    }

    const targetId =
      typeof questionId === "number" && Number.isFinite(questionId) ? questionId : null;
    if (!targetId) {
      setSubmitError("질문 정보를 확인할 수 없습니다.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await postAnswerReply(targetId, trimmedContents);
      navigate(`/answer-list?questionId=${targetId}`, {
        state: { questionId: targetId, questionText: questionTitle, questionDate },
      });
    } catch (error) {
      console.error("답변 전송 중 오류가 발생했습니다:", error);
      setSubmitError("답변을 전송하지 못했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <button type="button" className={styles.closeButton} onClick={() => navigate(-1)} aria-label="닫기">
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
            onChange={(event) => {
                const value = event.target.value;

                if (value.length > 120) {
                  setSubmitError("답변이 너무 길어요. 조금만 줄여주세요.");
                } else {
                  setSubmitError(null);
                }

                setAnswerContents(value)
            }}
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

export default WriteAnswer;
