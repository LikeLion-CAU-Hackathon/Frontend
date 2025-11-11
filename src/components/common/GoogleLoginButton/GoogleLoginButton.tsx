import styles from './GoogleLoginButton.module.css';
import googleLoginButtonImage from '../../../assets/images/google-login-button.svg';

const LOCAL_GOOGLE_AUTH_URL = 'http://localhost:8080/oauth2/authorization/google';
const PROD_GOOGLE_AUTH_URL = 'https://hackathon-santa.p-e.kr/oauth2/authorization/google';

const getGoogleAuthUrl = () => {
  const envUrl = import.meta.env?.VITE_GOOGLE_AUTH_URL;
  if (envUrl) return envUrl;

  if (typeof window === 'undefined') {
    return LOCAL_GOOGLE_AUTH_URL;
  }

  const isLocalhost =
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  return isLocalhost ? LOCAL_GOOGLE_AUTH_URL : PROD_GOOGLE_AUTH_URL;
};

const GoogleLoginButton = () => {
  const handleLogin = () => {
    const googleAuthUrl = getGoogleAuthUrl();
    window.location.assign(googleAuthUrl);
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
