import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postAnswerReply } from "../apis/answer/answer.api";

interface UseAnswerSubmitParams {
  questionId: number | null;
  questionText: string;
  questionDate?: string | null;
}

const MAX_ANSWER_LENGTH = 120;

export function useAnswerSubmit({ questionId, questionText, questionDate }: UseAnswerSubmitParams) {
  const navigate = useNavigate();
  const [answerContents, setAnswerContents] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleContentChange = (value: string) => {
    if (value.length > MAX_ANSWER_LENGTH - 1) {
      setSubmitError("답변이 너무 길어요. 조금만 줄여주세요.");
    } else {
      setSubmitError(null);
    }
    setAnswerContents(value);
  };

  const handleSubmit = async (event?: React.FormEvent) => {
    event?.preventDefault();
    const trimmedContents = answerContents.trim();
    
    if (trimmedContents.length === 0) {
      setSubmitError("답변 내용을 입력해 주세요.");
      return;
    }

    if (trimmedContents.length > MAX_ANSWER_LENGTH) {
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
        state: { questionId: targetId, questionText, questionDate },
      });
    } catch (error) {
      console.error("답변 전송 중 오류가 발생했습니다:", error);
      setSubmitError("답변을 전송하지 못했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    answerContents,
    isSubmitting,
    submitError,
    handleContentChange,
    handleSubmit,
  };
}
