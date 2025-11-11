import styles from './GoogleLoginButton.module.css';
import googleLoginButtonImage from '../../../assets/images/google-login-button.svg';

const GoogleLoginButton = () => {
  const handleLogin = () => {
    // TODO: 여기에 구글 로그인 로직 구현
    console.log('Google 로그인 시도');
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
