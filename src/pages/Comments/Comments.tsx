import styles from './Comments.module.css';
import sendIcon from '../../assets/images/send.svg';
import closeIcon from '../../assets/images/Comments/x.svg';
import heartIcon from '../../assets/images/Comments/heart.svg';
import commentIcon from '../../assets/images/Comments/comment.svg';

const featuredComment = {
  sender: '잘생긴 루돌프 (나)',
  date: 'DEC 7 | 18:44',
  content:
    '너는 친구들과 산에 스키를 타러 갔다. 첫 번째 날, 너와 그들은 스키장에서부터 보이는 밤하늘 정상까지, 올라갈 수 있는 가장 높은 곳으로 갔다. 네 친구들은 추위에 바로 내려갔다. 너는 혼자 작고 굳은 골짜기에 멈춰 서 있었다.',
};

const comments = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  author: index % 2 === 0 ? '못된 붕어빵' : '달콤한 마들렌',
  timestamp: `DEC ${22 - (index % 3)} | 12:${(25 + index).toString().padStart(2, '0')}:57`,
  body:
    '견뎌가 그들을 위협하거나 삶의 부조리가 잔혹한 겨울의 모퉁이에서 뛰어나올 때면, 그들은 너를 생각하고, 그러면 존재한다는 고통이 더는 그렇지 않다고 느껴.',
}));

const Comments = () => {
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
          <button className={styles.closeButton} type="button" aria-label="카드 닫기">
            <img src={closeIcon} alt="Close" />
          </button>
        </header>
        <div className={styles.cardDivider} aria-hidden="true">
        </div>
        <p className={styles.cardContent}>{featuredComment.content}</p>
        <footer className={styles.cardFooter}>
          <button className={styles.cardAction} type="button" aria-label="좋아요">
            <img src={heartIcon} alt="Like" /> 99
          </button>
          <button className={styles.cardAction} type="button" aria-label="댓글 보기">
            <img src={commentIcon} alt="Comments" /> 12
          </button>
        </footer>
      </section>

      <section className={styles.commentPanel} aria-label="댓글 영역">
        <h3 className={styles.sectionTitle}>Post Script</h3>
        <div className={styles.commentSection}>
          <ul className={styles.commentList}>
            {comments.map((comment) => (
              <li key={comment.id} className={styles.commentItem}>
                <p className={styles.commentMeta}>
                  {comment.author} | {comment.timestamp}
                </p>
                <p className={styles.commentBody}>{comment.body}</p>
              </li>
            ))}
          </ul>
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
