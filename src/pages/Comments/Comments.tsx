import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Comments.module.css";
import sendIcon from "../../assets/images/send.svg";
import closeIcon from "../../assets/images/Comments/x.svg";
import heartIcon from "../../assets/images/Comments/heart.svg";
import commentIcon from "../../assets/images/Comments/comment.svg";
import type { AnswerCardData } from "../../components/common/AnswerCard";
import { getAnswerReplies } from "../../apis/answer/answer.api";

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

const Comments = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state ?? {}) as {
    answer?: AnswerCardData | null;
    questionTitle?: string;
  };

  const answerId = state.answer?.id ?? null;
  const [replies, setReplies] = useState<ReplyItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const featuredComment = (() => {
    if (!state.answer) return fallbackFeatured;
    const { author, date, time, contents, likes, comments } = state.answer;
    const formattedDate = `${date.replace(/-/g, ".")} | ${time}`;
    return {
      sender: author,
      date: formattedDate,
      content: contents,
      likes,
      comments,
    };
  })();

  const commentPanelTitle = state.questionTitle?.trim() || "Post Script";

  useEffect(() => {
    if (!answerId) {
      setReplies([]);
      setIsLoading(false);
      setFetchError(null);
      return;
    }

    const fetchReplies = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const data = await getAnswerReplies(answerId);
        const mapped: ReplyItem[] = Array.isArray(data)
          ? data.map((reply: any) => ({
              id: reply.replyId ?? reply.id,
              author: reply.userName ?? reply.author ?? "익명",
              timestamp: reply.createdTime ?? reply.createdAt ?? "",
              body: reply.text ?? reply.contents ?? reply.body ?? "",
            }))
          : [];
        setReplies(mapped);
      } catch (error) {
        console.error("댓글을 가져오는 중 오류가 발생했습니다:", error);
        setReplies([]);
        setFetchError("댓글을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchReplies();
  }, [answerId]);

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return "";
    const parsed = new Date(timestamp);
    if (Number.isNaN(parsed.getTime())) return timestamp;
    const month = parsed.toLocaleString("en-US", { month: "short" }).toUpperCase();
    const day = parsed.getDate();
    const hours = String(parsed.getHours()).padStart(2, "0");
    const minutes = String(parsed.getMinutes()).padStart(2, "0");
    return `${month} ${day} | ${hours}:${minutes}`;
  };

  return (
    <div className={styles.container}>
      <section className={styles.featureCard} aria-label="강조된 댓글 카드">
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
            onClick={() => navigate(-1)}
          >
            <img src={closeIcon} alt="Close" />
          </button>
        </header>
        <div className={styles.cardDivider} aria-hidden="true">
        </div>
        <p className={styles.cardContent}>{featuredComment.content}</p>
        <footer className={styles.cardFooter}>
          <button className={styles.cardAction} type="button" aria-label="좋아요">
            <img src={heartIcon} alt="Like" /> {featuredComment.likes}
          </button>
          <button className={styles.cardAction} type="button" aria-label="댓글 보기">
            <img src={commentIcon} alt="Comments" /> {featuredComment.comments}
          </button>
        </footer>
      </section>

      <section className={styles.commentPanel} aria-label="댓글 영역">
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

        <form className={styles.replyBar} aria-label="댓글 입력" onSubmit={(event) => event.preventDefault()}>
          <input
            className={styles.replyInput}
            aria-label="댓글 입력창"
          />
          <button className={styles.replySubmit} type="submit" aria-label="댓글 보내기">
            <img src={sendIcon} alt="Send" />
          </button>
        </form>
      </section>
    </div>
  );
};

export default Comments;
