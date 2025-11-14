import styles from './Answer.module.css';
import tornPaperTexture from '../../assets/images/letters.svg';

const Answer = () => {
  return (
    <div className={styles.container}>
      <section className={styles.questionSection}>
        <p className={styles.questionOrder}>일곱 번째 질문:</p>
        <h2 className={styles.questionTitle}>가장 고마운 사람 언급하고 한 마디</h2>
        <p className={styles.questionSubtitle}>
          오늘의 질문에 답을 작성해 보세요. 마음 속 감사의 말을 편지로 전달합니다.
        </p>
      </section>

      <section className={styles.answerSection} aria-label="답변 입력 영역">
        <div className={styles.paper}>
          <div className={styles.paperTexture} style={{ backgroundImage: `url(${tornPaperTexture})` }} />
          <p className={styles.answerPreview}>엄마 아빠 사랑해요.</p>
        </div>
        <button className={styles.submitButton} type="button">
          답변하기
        </button>
      </section>
    </div>
  );
};

export default Answer;
