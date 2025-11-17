import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Comments.module.css";
import sendIcon from "../../assets/images/send.svg";
import closeIcon from "../../assets/images/Comments/x.svg";
import heartIcon from "../../assets/images/Comments/heart.svg";
import heartFilledIcon from "../../assets/images/Comments/heart-filled.svg";
import commentIcon from "../../assets/images/Comments/comment.svg";
import type { AnswerCardData } from "../../components/common/AnswerCard";
import { getAnswerReplies, getAnswerLikeCount, postAnswerComment } from "../../apis/answer/answer.api";
import { addLike, deleteLike } from "../../apis/answer/like.api";
import { toggleStoredLikedAnswer } from "../../utils/likedAnswers";
import Overlay from "../../components/common/Overlay/Overlay";

const fallbackFeatured = {
  sender: "잘생긴 루돌프 (나)",
  date: "DEC 7 | 18:44",
  content:
    "너는 친구들과 산에 스키를 타러 갔다. 첫 번째 날, 너와 그들은 스키장에서부터 보이는 밤하늘 정상까지, 올라갈 수 있는 가장 높은 곳으로 갔다. 네 친구들은 추위에 바로 내려갔다. 너는 혼자 작고 굳은 골짜기에 멈춰 서 있었다.",
  likes: 99,
  comments: 12,
};

interface ReplyItem {
  id: number;
  author: string;
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

const Comments = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state ?? {}) as {
    answer?: AnswerCardData | null;
    questionTitle?: string;
    backgroundImg?: string;
  };

  const answerId = state.answer?.id ?? null;
  const [replies, setReplies] = useState<ReplyItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [replyContents, setReplyContents] = useState("");
  const [isPostingReply, setIsPostingReply] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);
  const [likeCount, setLikeCount] = useState(state.answer?.likes ?? 0);
  const [isLiked, setIsLiked] = useState<boolean>(Boolean(state.answer?.liked));
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [likeError, setLikeError] = useState<string | null>(null);
  const [commentCount, setCommentCount] = useState(
    state.answer?.comments ?? fallbackFeatured.comments
  );
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [isCardVisible, setIsCardVisible] = useState(false);

  const featuredComment = (() => {
    if (!state.answer) return fallbackFeatured;
    const { author, date, time, contents, likes } = state.answer;
    const formattedDate = `${date.replace(/-/g, ".")} | ${time}`;
    return {
      sender: author,
      date: formattedDate,
      content: contents,
      likes,
      comments: commentCount,
    };
  })();

  const commentPanelTitle = "Post Script";

  useEffect(() => {
    setLikeCount(state.answer?.likes ?? 0);
    setIsLiked(Boolean(state.answer?.liked));
    setCommentCount(state.answer?.comments ?? fallbackFeatured.comments);
  }, [state.answer]);

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
            return {
              id: reply.replyId ?? reply.id ?? index,
              author: nickname ?? "익명",
              timestamp: reply.createdTime ?? reply.createdAt ?? "",
              body: reply.text ?? reply.contents ?? reply.body ?? "",
            };
          })
        : [];
      setReplies(mapped);
      setCommentCount(mapped.length);
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
      setLikeCount(0);
      setIsLiked(false);
      return;
    }
    try {
      const data = await getAnswerLikeCount(answerId);
      const derivedCount =
        typeof data === "number"
          ? data
          : data?.likeCount ?? state.answer?.likes ?? 0;
      setLikeCount(derivedCount);
      if (typeof data?.liked === "boolean") {
        setIsLiked(data.liked);
      }
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

    setIsPostingReply(true);
    setReplyError(null);
    try {
      await postAnswerComment(answerId, trimmed);
      setReplyContents("");
      setCommentCount((prev) => prev + 1);
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

  const handleLikeToggle = async () => {
    if (!answerId || isLikeLoading) return;
    setIsLikeLoading(true);
    setLikeError(null);
    const optimisticLiked = !isLiked;
    const optimisticDelta = optimisticLiked ? 1 : -1;
    setIsLiked(optimisticLiked);
    setLikeCount((prev) => Math.max(0, prev + optimisticDelta));
    try {
      const response = isLiked ? await deleteLike(answerId) : await addLike(answerId);
      const serverLiked =
        typeof response?.liked === "boolean" ? response.liked : optimisticLiked;
      const serverCount =
        typeof response?.likeCount === "number" ? response.likeCount : null;
      setIsLiked(serverLiked);
      if (typeof serverCount === "number") {
        setLikeCount(Math.max(0, serverCount));
      } else if (serverLiked !== optimisticLiked) {
        const correctiveDelta = serverLiked ? 1 : -1;
        setLikeCount((prev) => Math.max(0, prev + correctiveDelta - optimisticDelta));
      }
      toggleStoredLikedAnswer(answerId, serverLiked);
    } catch (error) {
      console.error("좋아요 처리 중 오류가 발생했습니다:", error);
      setLikeError("좋아요 요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.");
      setIsLiked((prev) => !prev);
      setLikeCount((prev) => Math.max(0, prev - optimisticDelta));
    } finally {
      setIsLikeLoading(false);
    }
  };

  const backgroundImage =
    state.backgroundImg ?? new URL("../../assets/images/background/bg1.png", import.meta.url).href;

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return "";
    const parsed = new Date(timestamp);
    if (Number.isNaN(parsed.getTime())) return timestamp;
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
        aria-label="강조된 댓글 카드"
      >
        <header className={styles.cardHeader}>
          <div>
            <p className={styles.cardFrom}>
              <span className={styles.cardLabel}>From.</span>
              <span className={styles.cardValue}>{featuredComment.sender}</span>
            </p>
            <p className={styles.cardDate}>
              <span className={styles.cardLabel}>Date:</span>
              <span className={styles.cardValue}>{featuredComment.date}</span>
            </p>
          </div>
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
        </header>
        <div className={styles.cardDivider} aria-hidden="true">
        </div>
        <p className={styles.cardContent}>{featuredComment.content}</p>
        <footer className={styles.cardFooter}>
          <button
            className={`${styles.cardAction} ${styles.heartAction} ${isLiked ? styles.heartActive : ""}`}
            type="button"
            aria-label="좋아요"
            onClick={handleLikeToggle}
            disabled={!answerId || isLikeLoading}
            aria-pressed={isLiked}
          >
            <img src={isLiked ? heartFilledIcon : heartIcon} alt="Like" /> {likeCount}
          </button>
          <button className={styles.cardAction} type="button" aria-label="댓글 보기">
            <img src={commentIcon} alt="Comments" /> {featuredComment.comments}
          </button>
        </footer>
        {likeError && <p className={styles.likeError}>{likeError}</p>}
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
