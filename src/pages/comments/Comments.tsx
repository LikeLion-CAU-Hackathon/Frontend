import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Comments.module.css";
import sendIcon from "../../assets/images/send.svg";
import closeIcon from "../../assets/images/Comments/x.svg";
import type { AnswerCardData } from "../../components/common/AnswerCard";
import AnswerCard from "../../components/common/AnswerCard";
import { getAnswerReplies, getAnswerLikeCount, postAnswerComment } from "../../apis/answer/answer.api";
import Overlay from "../../components/common/overlay/Overlay";
import { getMyProfile } from "../../apis/user/user.api";

const createFallbackFeatured = (): AnswerCardData => ({
  id: -1,
  author: "잘생긴 루돌프 (나)",
  date: "DEC 7",
  time: "18:44",
  contents:
    "너는 친구들과 산에 스키를 타러 갔다. 첫 번째 날, 너와 그들은 스키장에서부터 보이는 밤하늘 정상까지, 올라갈 수 있는 가장 높은 곳으로 갔다. 네 친구들은 추위에 바로 내려갔다. 너는 혼자 작고 굳은 골짜기에 멈춰 서 있었다.",
  likes: 99,
  comments: 12,
  liked: false,
});

interface ReplyItem {
  id: number;
  author: string;
  baseAuthor: string;
  isMine: boolean;
  timestamp: string;
  body: string;
}

type RawReply = {
  replyId?: number;
  id?: number;
  userName?: string;
  userNickname?: string;
  nickname?: string;
  author?: string;
  createdTime?: string;
  createdAt?: string;
  text?: string;
  contents?: string;
  body?: string;
  writer?: {
    nickname?: string;
    name?: string;
  };
  user?: {
    nickname?: string;
    name?: string;
  };
};

const stripOwnIndicator = (value: string): string => value.replace(/\s*\(나\)\s*$/, "").trim();

const formatAuthorWithOwnership = (rawValue: string | undefined | null, nickname: string | null) => {
  const trimmed = typeof rawValue === "string" ? rawValue.trim() : "";
  const withoutIndicator = stripOwnIndicator(trimmed);
  const baseAuthor = withoutIndicator.length > 0 ? withoutIndicator : "익명";
  const isMine = Boolean(nickname && baseAuthor === nickname);
  const displayAuthor = isMine ? `${baseAuthor} (나)` : baseAuthor;
  return { displayAuthor, baseAuthor, isMine };
};

const updateRepliesWithNickname = (replies: ReplyItem[], nickname: string | null): ReplyItem[] => {
  if (!replies.length) {
    return replies;
  }
  let changed = false;
  const updated = replies.map((reply) => {
    const { displayAuthor, baseAuthor, isMine } = formatAuthorWithOwnership(
      reply.baseAuthor || reply.author,
      nickname
    );
    if (
      reply.author === displayAuthor &&
      reply.baseAuthor === baseAuthor &&
      reply.isMine === isMine
    ) {
      return reply.baseAuthor ? reply : { ...reply, baseAuthor };
    }
    changed = true;
    return { ...reply, author: displayAuthor, baseAuthor, isMine };
  });
  return changed ? updated : replies;
};

const monthLabels = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

const formatCardDateLabel = (value?: string | null): string => {
  if (!value) return "";
  const trimmed = value.trim();
  if (trimmed.length === 0) return "";
  const isoMatch = /^(\d{4})[-/.](\d{2})[-/.](\d{2})/.exec(trimmed);
  if (isoMatch) {
    const [, , month, day] = isoMatch;
    const monthIndex = Number(month) - 1;
    const label = monthLabels[monthIndex] ?? month.toUpperCase();
    const dayNumber = Number(day);
    return `${label} ${Number.isFinite(dayNumber) ? dayNumber : day}`;
  }
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return trimmed;
  }
  const month = parsed.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const day = parsed.getDate();
  return `${month} ${day}`;
};

const normalizeFeaturedAnswer = (answer?: AnswerCardData | null): AnswerCardData => {
  if (answer) {
    return {
      ...answer,
      liked: Boolean(answer.liked),
      date: formatCardDateLabel(answer.date),
      time: answer.time ?? "",
    };
  }
  return createFallbackFeatured();
};

const Comments = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state ?? {}) as {
    answer?: AnswerCardData | null;
    questionTitle?: string;
    backgroundImg?: string;
    cardId?: number | string | null;
  };

  const answerId = state.answer?.id ?? null;
  const [replies, setReplies] = useState<ReplyItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [replyContents, setReplyContents] = useState("");
  const [isPostingReply, setIsPostingReply] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);
  const [featuredAnswer, setFeaturedAnswer] = useState<AnswerCardData>(() => normalizeFeaturedAnswer(state.answer));
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [isCardVisible, setIsCardVisible] = useState(false);

  const commentPanelTitle = "Post Script";

  useEffect(() => {
    setFeaturedAnswer(normalizeFeaturedAnswer(state.answer));
  }, [state.answer]);

  const [myNickname, setMyNickname] = useState<string | null>(null);
  const myNicknameRef = useRef<string | null>(null);

  useEffect(() => {
    myNicknameRef.current = myNickname;
    setReplies((prev) => updateRepliesWithNickname(prev, myNickname));
  }, [myNickname]);

  useEffect(() => {
    let cancelled = false;
    const resolveQuestionParam = () => {
      if (typeof state.cardId === "number" && Number.isFinite(state.cardId)) {
        return state.cardId;
      }
      if (typeof state.cardId === "string" && state.cardId.trim().length > 0) {
        const asNumber = Number(state.cardId);
        if (Number.isFinite(asNumber)) {
          return asNumber;
        }
        return state.cardId;
      }
      return undefined;
    };

    const fetchProfile = async () => {
      try {
        const profile = await getMyProfile(resolveQuestionParam());
        if (cancelled) return;
        const nickname =
          profile?.nickname ??
          profile?.userNickname ??
          profile?.name ??
          profile?.username ??
          null;
        setMyNickname(nickname);
      } catch (error: any) {
        console.error("내 프로필 정보를 불러오지 못했습니다:", error);
        /* 질문 Id가 없을 경우 로그인 페이지로 redirect */
        if (error.message === "questionId가 존재하지 않습니다.") {
          navigate("/", { replace: true });   
          return;
        }

        if (!cancelled) {
          setMyNickname(null);
        }
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [state.cardId]);

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
      const mapped: ReplyItem[] = Array.isArray(data)
        ? data.map((reply: RawReply, index: number) => {
            const nickname =
              reply.userNickname ??
              reply.nickname ??
              reply.userName ??
              reply.author ??
              (typeof (reply as { writer?: { nickname?: string; name?: string } }).writer?.nickname ===
              "string"
                ? (reply as { writer?: { nickname?: string } }).writer!.nickname
                : undefined) ??
              (typeof (reply as { writer?: { name?: string } }).writer?.name === "string"
                ? (reply as { writer?: { name?: string } }).writer!.name
                : undefined) ??
              (typeof (reply as { user?: { nickname?: string; name?: string } }).user?.nickname ===
              "string"
                ? (reply as { user?: { nickname?: string } }).user!.nickname
                : undefined) ??
              (typeof (reply as { user?: { name?: string } }).user?.name === "string"
                ? (reply as { user?: { name?: string } }).user!.name
                : undefined);
            const { displayAuthor, baseAuthor, isMine } = formatAuthorWithOwnership(
              nickname,
              myNicknameRef.current
            );
            return {
              id: reply.replyId ?? reply.id ?? index,
              author: displayAuthor,
              baseAuthor,
              isMine,
              timestamp: reply.createdTime ?? reply.createdAt ?? "",
              body: reply.text ?? reply.contents ?? reply.body ?? "",
            };
          })
        : [];
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
  }, [answerId]);

  useEffect(() => {
    void fetchReplies();
  }, [fetchReplies]);

  // 페이지 마운트 시 애니메이션 시작
  useEffect(() => {
      setTimeout(() => {
    setIsCardVisible(true);
  }, 200); // 0.5초 뒤 카드 등장

    // commentPanel은 즉시 아래에서 올라오기 시작 (카드 전환과 동시에)
    setIsPanelVisible(true);
  }, []);

  const fetchLikeCount = useCallback(async () => {
    if (!answerId) {
      return;
    }
    try {
      const data = await getAnswerLikeCount(answerId);
      const derivedCount =
        typeof data === "number"
          ? data
          : data?.likeCount ?? state.answer?.likes ?? 0;
      setFeaturedAnswer((prev) => ({
        ...prev,
        likes: derivedCount,
        liked: typeof data?.liked === "boolean" ? data.liked : prev.liked,
      }));
    } catch (error) {
      console.error("좋아요 수를 가져오는 중 오류가 발생했습니다:", error);
    }
  }, [answerId, state.answer?.likes]);

  useEffect(() => {
    void fetchLikeCount();
  }, [fetchLikeCount]);

  const handleReplySubmit = async (event: FormEvent<HTMLFormElement>) => {
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

  const isReplyInputEmpty = replyContents.trim().length === 0;
  const isReplyDisabled = !answerId || isPostingReply;
  const replyPlaceholder = answerId
    ? "댓글을 입력해 주세요."
    : "답변을 선택한 후 댓글을 남길 수 있어요.";

  const backgroundImage =
    state.backgroundImg ?? new URL("../../assets/images/background/bg1.png", import.meta.url).href;

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return "";
    const trimmed = timestamp.trim();
    if (trimmed.length === 0) return "";

    const tryFormatIso = (value: string): string | null => {
      const isoMatch =
        /^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2})(?::?(\d{2}))?(?::?(\d{2}))?)?$/.exec(value);
      if (!isoMatch) return null;
      const [, , month, day, hour, minute, second] = isoMatch;
      const monthIndex = Number(month) - 1;
      const label = monthLabels[monthIndex] ?? month.toUpperCase();
      const dayNumber = Number(day);
      const datePart = `${label} ${Number.isFinite(dayNumber) ? dayNumber : day}`;
      if (hour !== undefined && minute !== undefined) {
        const hh = hour.padStart(2, "0");
        const mm = minute.padStart(2, "0");
        const ss = (second ?? "00").padStart(2, "0");
        return `${datePart} | ${hh}:${mm}:${ss}`;
      }
      return datePart;
    };

    const isoFormatted = tryFormatIso(trimmed);
    if (isoFormatted) {
      return isoFormatted;
    }

    const parsed = new Date(trimmed);
    if (Number.isNaN(parsed.getTime())) {
      return trimmed;
    }
    const month = parsed.toLocaleString("en-US", { month: "short" }).toUpperCase();
    const day = parsed.getDate();
    const hours = String(parsed.getHours()).padStart(2, "0");
    const minutes = String(parsed.getMinutes()).padStart(2, "0");
    const seconds = String(parsed.getSeconds()).padStart(2, "0");
    return `${month} ${day} | ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div
      className={styles.container}
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <Overlay isVisible bgColor="rgba(0,0,0,0.6)" disablePointerEvents />
      <section 
        className={`${styles.featureCard} ${isCardVisible ? styles.featureCardVisible : ''}`} 
        aria-label="애니메이션 댓글 카드"
      >
        <button
          className={styles.closeButton}
          type="button"
          aria-label="카드 닫기"
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              navigate("/answer-list");
            }
          }}
        >
          <img src={closeIcon} alt="Close" />
        </button>
        <AnswerCard
          {...featuredAnswer}
          width="100%"
          height="100%"
        />
      </section>

      <section 
        className={`${styles.commentPanel} ${isPanelVisible ? styles.commentPanelVisible : ''}`} 
        aria-label="댓글 영역"
      >
        <h3 className={styles.sectionTitle}>{commentPanelTitle}</h3>
        <div className={styles.commentSection}>
          {isLoading && <p className={styles.statusMessage}>댓글을 불러오는 중입니다...</p>}
          {fetchError && !isLoading && <p className={styles.statusMessage}>{fetchError}</p>}
          {!isLoading && !fetchError && replies.length === 0 && (
            <p className={styles.statusMessage}>첫 번째 댓글을 남겨보세요.</p>
          )}
          {!isLoading && !fetchError && replies.length > 0 && (
            <ul className={styles.commentList}>
              {replies.map((comment) => (
                <li key={comment.id} className={styles.commentItem}>
                  <p className={styles.commentMeta}>
                    {comment.author} | {formatTimestamp(comment.timestamp)}
                  </p>
                  <p className={styles.commentBody}>{comment.body}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form className={styles.replyBar} aria-label="댓글 입력" onSubmit={handleReplySubmit}>
          <input
            className={styles.replyInput}
            aria-label="댓글 입력창"
            placeholder={replyPlaceholder}
            value={replyContents}
            onChange={(event) => {
              setReplyContents(event.target.value);
              if (replyError) {
                setReplyError(null);
              }
            }}
            disabled={isReplyDisabled}
          />
          <button
            className={styles.replySubmit}
            type="submit"
            aria-label="댓글 보내기"
            disabled={isReplyDisabled || isReplyInputEmpty}
          >
            <img src={sendIcon} alt="Send" />
          </button>
        </form>
        {replyError && (
          <p className={styles.replyError} role="alert">
            {replyError}
          </p>
        )}
      </section>
    </div>
  );
};

export default Comments;
