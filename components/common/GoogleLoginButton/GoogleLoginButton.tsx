import styles from './GoogleLoginButton.module.css';
import googleLogo from '../../../src/assets/images/google-logo.svg';

const GoogleLoginButton = () => {
  const handleLogin = () => {
    // TODO: 여기에 구글 로그인 로직 구현
    console.log('Google 로그인 시도');
  };

  return (
    <button type="button" className={styles.loginButton} onClick={handleLogin}>
      <img src={googleLogo} alt="Google logo" className={styles.logo} />
      Log in with Google
    </button>
  );
};

export default GoogleLoginButton;
