import { useEffect, useRef, useState } from "react";
import { getQuestion } from "../apis/question/question.api";
import { getAnswerList } from "../apis/answer/answer.api";
import { convertIdToDate, extractDateTimeFromTimestamp } from "../utils/date";
import { updateAnswerOwnership } from "../utils/answer";
import type { Answer } from "../utils/answer";
import { getMyProfile } from "../apis/user/user.api";

interface Params {
  cardId: string | null;
  canAccess: boolean;
  setLoading: (value: boolean) => void;
}

export function useAnswerListData({ cardId, canAccess, setLoading }: Params) {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [question, setQuestion] = useState<string>("");
  const [myNickname, setMyNickname] = useState<string | null>(null);
  const myNicknameRef = useRef<string | null>(null);

  useEffect(() => {
    if (!canAccess) return;

    let cancelled = false;
    const cardIdNumber =
      typeof cardId === "string" && cardId.trim().length > 0 ? Number(cardId) : NaN;
    const questionIdParam = Number.isFinite(cardIdNumber) ? cardIdNumber : undefined;
    const fetchProfile = async () => {
      try {
        const profile = await getMyProfile(questionIdParam);
        const nickname =
          profile?.nickname ??
          profile?.userNickname ??
          profile?.name ??
          profile?.username ??
          null;
        if (!cancelled) {
          setMyNickname(nickname);
        }
      } catch (error) {
        console.error("내 프로필 정보를 불러오지 못했습니다:", error);
        if (!cancelled) {
          setMyNickname(null);
        }
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [cardId, canAccess]);

  useEffect(() => {
    if (!canAccess) return;
    if (!cardId) {
      setLoading(false);
      return;
    }

    const fetchQuestionAndAnswers = async () => {
      try {
        setLoading(true);
        const cardIdNumber = Number(cardId);

        const date = convertIdToDate(cardIdNumber);
        const questionResponse = await getQuestion(date);
        setQuestion(questionResponse.content || "");

        const answerData = await getAnswerList(cardIdNumber);

        const mappedData = answerData.map((response: any) => {
          const writerNickname =
            response.userNickname ??
            response.nickname ??
            response.userName ??
            response.author ??
            "익명";

          const likedAnswers = JSON.parse(localStorage.getItem("likedAnswers") || "[]");
          const isLiked = likedAnswers.includes(response.answerId) || response.liked || false;

          const { date: formattedDate, time: formattedTime } = extractDateTimeFromTimestamp(
            response.createdTime
          );

          return {
            id: response.answerId,
            author: writerNickname,
            writerNickname,
            date: formattedDate,
            time: formattedTime,
            contents: response.contents,
            likes: response.likeCount,
            comments: response.replyCount,
            liked: isLiked,
          };
        });

        const nicknameSnapshot = myNicknameRef.current ?? null;
        setAnswers(updateAnswerOwnership(mappedData, nicknameSnapshot));
      } catch (error) {
        console.error("질문 또는 답변 리스트를 불러오는 데 오류가 발생했습니다: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionAndAnswers();
  }, [cardId, canAccess, setLoading]);

  useEffect(() => {
    setAnswers((prev) => updateAnswerOwnership(prev, myNickname));
  }, [myNickname]);

  useEffect(() => {
    myNicknameRef.current = myNickname;
  }, [myNickname]);

  return {
    answers,
    setAnswers,
    question,
    setQuestion,
    myNicknameRef,
    myNickname,
  };
}

