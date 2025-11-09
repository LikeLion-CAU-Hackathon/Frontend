import GoogleLoginButton from '../../components/common/GoogleLoginButton/GoogleLoginButton';
import styles from './Login.module.css';
import envelopesStackImg from '../../src/assets/images/Frame 30.svg';

const Login = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Likelion Postbox:</h1>
        <h2 className={styles.subtitle}>2025 Advent Calendar</h2>
      </header>

      <main className={styles.content}>
        <img src={envelopesStackImg} alt="Stacked envelopes" className={styles.envelopes} />
      </main>

      <footer className={styles.footer}>
        <GoogleLoginButton />
      </footer>
    </div>
  );
};

export default Login;
