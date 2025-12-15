import { useEffect, useState } from "react";
import { getQuestion } from "../apis/question/question.api";
import { getTodayDate } from "../utils/date";

interface UseQuestionParams {
  questionId?: number | null;
  questionText?: string;
  questionDate?: string | null;
}

export function useQuestion({ questionId, questionText, questionDate }: UseQuestionParams) {
  const [questionTitle, setQuestionTitle] = useState(() => questionText?.trim() ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const trimmed = questionText?.trim() ?? "";
    if (trimmed.length > 0) {
      setQuestionTitle(trimmed);
      setIsLoading(false);
      setError(null);
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
      setIsLoading(true);
      setError(null);
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
          setError("로그인 후 오늘의 질문에 답변해보세요!");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchQuestion();

    return () => {
      isMounted = false;
    };
  }, [questionDate, questionId, questionText]);

  return {
    questionTitle,
    isLoading,
    error,
  };
}
