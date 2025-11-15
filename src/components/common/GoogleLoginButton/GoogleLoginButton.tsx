import styles from "./GoogleLoginButton.module.css";
import googleLoginButtonImage from "../../../assets/images/google-login-button.svg";
import { GOOGLE_AUTH_URL } from "../../../constants/oauth";

const GoogleLoginButton = () => {
  const handleLogin = () => {
    window.location.href = GOOGLE_AUTH_URL;
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
