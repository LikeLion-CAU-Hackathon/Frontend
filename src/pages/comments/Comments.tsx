import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "@/pages/comments/Comments.module.css";
import sendIcon from "@/assets/images/send.svg";
import closeIcon from "@/assets/images/comments/x.svg";
import type { AnswerCardData } from "@/components/common/AnswerCard";
import AnswerCard from "@/components/common/AnswerCard";
import Overlay from "@/components/common/overlay/Overlay";
import { normalizeFeaturedAnswer } from "@/utils/comments";
import { useCommentProfile } from "@/hooks/useCommentProfile";
import { useCommentsReplies } from "@/hooks/useCommentsReplies";

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
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [isCardVisible, setIsCardVisible] = useState(false);
  const commentPanelTitle = "Post Script";

  const [featuredAnswer, setFeaturedAnswer] = useState<AnswerCardData>(() =>
    normalizeFeaturedAnswer(state.answer)
  );

  useEffect(() => {
    setFeaturedAnswer(normalizeFeaturedAnswer(state.answer));
  }, [state.answer]);

  const { myNicknameRef } = useCommentProfile({
    cardId: state.cardId,
    navigate,
  });

  const {
    replies,
    isLoading,
    fetchError,
    replyContents,
    replyError,
    featuredAnswer: featuredFromHook,
    handleReplySubmit,
    handleReplyChange,
    formatTimestamp,
    isReplyInputEmpty,
    isReplyDisabled,
  } = useCommentsReplies({
    answerId,
    initialFeatured: featuredAnswer,
    myNicknameRef,
  });

  useEffect(() => {
    setFeaturedAnswer(featuredFromHook);
  }, [featuredFromHook]);

  // 페이지 마운트 시 애니메이션 시작
  useEffect(() => {
    setTimeout(() => {
      setIsCardVisible(true);
    }, 200);
    setIsPanelVisible(true);
  }, []);

  const replyPlaceholder = answerId
    ? "댓글을 입력해 주세요."
    : "답변을 선택한 후 댓글을 남길 수 있어요.";

  const backgroundImage =
    state.backgroundImg ?? new URL("../../assets/images/background/bg1.png", import.meta.url).href;

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
            onChange={(event) => handleReplyChange(event.target.value)}
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
