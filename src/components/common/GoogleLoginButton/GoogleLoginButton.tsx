import styles from './GoogleLoginButton.module.css';
import googleLoginButtonImage from '../../../assets/images/google-login-button.svg';

const GOOGLE_AUTH_BASE_URL =
  import.meta.env?.VITE_GOOGLE_AUTH_URL ??
  'https://hackathon-santa.p-e.kr/oauth2/authorization/google';

const GoogleLoginButton = () => {
  const handleLogin = () => {
    const currentOrigin = window.location.origin;
    const callbackUrl = new URL('/login', currentOrigin);
    callbackUrl.searchParams.set('redirect', '/calendar');

    const authUrl = new URL(GOOGLE_AUTH_BASE_URL);
    authUrl.searchParams.set('redirect_uri', callbackUrl.toString());

    window.location.assign(authUrl.toString());
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
