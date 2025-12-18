import { useEffect, useState } from "react";
import { checkAnswered } from "@/apis/answer/answer.api";

interface Params {
  cardId: string | null;
  navigate: any;
  setLoading: (value: boolean) => void;
}

export function useAnswerListAccess({ cardId, navigate, setLoading }: Params) {
  const [accessChecked, setAccessChecked] = useState(false);
  const [canAccess, setCanAccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    if (!cardId) {
      setLoading(false);
      setAccessChecked(true);
      setCanAccess(false);
      return;
    }

    let cancelled = false;

    const checkAccess = async () => {
      try {
        const response = await checkAnswered(Number(cardId));
        console.log("답변여부", response.answered);

        if (cancelled) return;

        if (!response.answered) {
          setModalMessage("답변하지 않은 질문에 대한 접근입니다. \n당장 내쫓겠습니다🎅🏻");
          setIsModalOpen(true);
          setCanAccess(false);
          setLoading(false);
          return;
        }

        setCanAccess(true);
      } catch (e) {
        if (cancelled) return;
        console.error("답변 여부 확인 실패", e);
        setModalMessage("접근할 수 없는 페이지입니다.");
        setIsModalOpen(true);
        setCanAccess(false);
        setLoading(false);
      } finally {
        if (!cancelled) {
          setAccessChecked(true);
        }
      }
    };

    checkAccess();

    return () => {
      cancelled = true;
    };
  }, [cardId, navigate, setLoading]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    navigate("/calendar", { replace: true });
  };

  return {
    accessChecked,
    canAccess,
    isModalOpen,
    modalMessage,
    handleModalClose,
  };
}

