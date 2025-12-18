import { useCallback, useEffect, useState } from "react";
import { getAnswerReplies, getAnswerLikeCount, postAnswerComment } from "@/apis/answer/answer.api";
import type { AnswerCardData } from "@/components/common/AnswerCard";
import { mapReplies, updateRepliesWithNickname } from "@/utils/comments";
import type { ReplyItem } from "@/utils/comments";
import { formatTimestampWithSeconds } from "@/utils/date";

interface Params {
  answerId: number | null;
  initialFeatured: AnswerCardData;
  myNicknameRef: React.MutableRefObject<string | null>;
}

export function useCommentsReplies({ answerId, initialFeatured, myNicknameRef }: Params) {
  const [replies, setReplies] = useState<ReplyItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [replyContents, setReplyContents] = useState("");
  const [isPostingReply, setIsPostingReply] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);
  const [featuredAnswer, setFeaturedAnswer] = useState<AnswerCardData>(initialFeatured);

  useEffect(() => {
    setFeaturedAnswer(initialFeatured);
  }, [initialFeatured]);

  const fetchReplies = useCallback(async () => {
    if (!answerId) {
      setReplies([]);
      setIsLoading(false);
      setFetchError(null);
      return;
    }

    setIsLoading(true);
    setFetchError(null);
    try {
      const data = await getAnswerReplies(answerId);
      const mapped = mapReplies(data, myNicknameRef);
      setReplies(mapped);
      setFeaturedAnswer((prev) => ({
        ...prev,
        comments: mapped.length,
      }));
    } catch (error) {
      console.error("댓글을 가져오는 중 오류가 발생했습니다:", error);
      setReplies([]);
      setFetchError("댓글을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [answerId, myNicknameRef]);

  useEffect(() => {
    void fetchReplies();
  }, [fetchReplies]);

  const fetchLikeCount = useCallback(async () => {
    if (!answerId) return;
    try {
      const data = await getAnswerLikeCount(answerId);
      const derivedCount =
        typeof data === "number" ? data : data?.likeCount ?? featuredAnswer.likes ?? 0;
      setFeaturedAnswer((prev) => ({
        ...prev,
        likes: derivedCount,
        liked: typeof data?.liked === "boolean" ? data.liked : prev.liked,
      }));
    } catch (error) {
      console.error("좋아요 수를 가져오는 중 오류가 발생했습니다:", error);
    }
  }, [answerId, featuredAnswer.likes]);

  useEffect(() => {
    void fetchLikeCount();
  }, [fetchLikeCount]);

  const handleReplySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!answerId) {
      setReplyError("댓글을 작성할 답변을 찾을 수 없습니다.");
      return;
    }
    const trimmed = replyContents.trim();
    if (trimmed.length === 0) {
      setReplyError("댓글을 입력해 주세요.");
      return;
    }
    if (trimmed.length > 119) {
      setReplyError("댓글이 너무 길어요. 조금만 줄여주세요.");
      return;
    }

    setIsPostingReply(true);
    setReplyError(null);
    try {
      await postAnswerComment(answerId, trimmed);
      setReplyContents("");
      setFeaturedAnswer((prev) => ({
        ...prev,
        comments: prev.comments + 1,
      }));
      await fetchReplies();
    } catch (error) {
      console.error("댓글을 전송하는 중 오류가 발생했습니다:", error);
      setReplyError("댓글을 전송하지 못했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsPostingReply(false);
    }
  };

  const handleReplyChange = (value: string) => {
    setReplyContents(value);
    if (replyError) setReplyError(null);
  };

  const repliesWithNickname = updateRepliesWithNickname(replies, myNicknameRef.current);

  return {
    replies: repliesWithNickname,
    isLoading,
    fetchError,
    replyContents,
    isPostingReply,
    replyError,
    featuredAnswer,
    setFeaturedAnswer,
    handleReplySubmit,
    handleReplyChange,
    fetchReplies,
    formatTimestamp: formatTimestampWithSeconds,
    isReplyInputEmpty: replyContents.trim().length === 0,
    isReplyDisabled: !answerId || isPostingReply,
  };
}

