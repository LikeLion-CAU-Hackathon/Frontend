import styles from './GoogleLoginButton.module.css';
import googleLoginButtonImage from '../../../assets/images/google-login-button.svg';

const GOOGLE_AUTH_BASE_URL =
  import.meta.env?.VITE_GOOGLE_AUTH_URL ??
  'https://hackathon-santa.p-e.kr/oauth2/authorization/google';

const GoogleLoginButton = () => {
  const handleLogin = () => {
    window.location.href = GOOGLE_AUTH_BASE_URL;
  };

  return (
    <button
      type="button"
      className={styles.loginButton}
      onClick={handleLogin}
      aria-label="Log in with Google"
    >
      <img src={googleLoginButtonImage} alt="" aria-hidden="true" className={styles.buttonImage} />
    </button>
  );
};

export default GoogleLoginButton;
